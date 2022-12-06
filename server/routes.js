import { v4 as uuidv4 } from 'uuid';

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
const multer = require('multer');


const router = express.Router();

const apiPath = 'http://localhost:9200';

const formDataHandler = multer();

// const processFile = require("./middleware/upload");

const { format } = require('util');
const { Storage } = require('@google-cloud/storage');

// Instantiate a storage client with credentials
const storage = new Storage({
  keyFilename: './src/server/digital-wiki-tmatcha-20bfcf0a8f2e.json',
});

const bucket = storage.bucket('digital-wiki-tmatcha.appspot.com');

const ES_CONFIG = {
  userKey: 'ylfmarzslsckbfvmptantcimnvriyt',
  pageRankSqThreshold: '0.8',
  applyPageRankSqThreshold: 'true',
  nTopDfValuesToIgnore: '200',
  nWordsToIgnoreFromList: '200',
  wikiDataClasses: 'true',
  wikiDataClassIds: 'false',
  support: 'true',
  ranges: 'false',
  minLinkFrequency: '2',
  includeCosines: 'false',
  maxMentionEntropy: '3',
  lang: 'en',
};

const wikifier_config = {
  method: 'post',
  url: 'http://www.wikifier.org/annotate-article',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};



// get all etds
router.get('/search', async (req, res) => {
  
  const body = {
    query: {
      multi_match: {
        query: req.query.search,
        fields: ['title', 'text'],
        type: 'best_fields',
        tie_breaker: 0.3,
        minimum_should_match: '30%',
      },
    },
    size: 500,
  };
  console.log('req.query.search', body);

  const response = await axios({
    method: 'GET',
    url: `${apiPath}/digi_wiki/_search`,
    data: body,
  });
  console.log('response.data', response.data);
  res.json({
    results: response.data?.hits?.hits,
    count: response.data?.hits?.total?.value,
  });
});

router.post('/insertDocument', formDataHandler.any(), async (req, res) => {
  try {
    const { author, abstract, advisor, degree, program, title, university, year } = req.body;

    console.log({ req: req.body });

    if (!author) {
      res.status(400).send({ message: 'author is required' });
      return;
    }
    if (!advisor) {
      res.status(400).send({ message: 'advisor is required' });
      return;
    }
    if (!degree) {
      res.status(400).send({ message: 'degree is required' });
      return;
    }
    if (!title) {
      res.status(400).send({ message: 'title is required' });
      return;
    }
    if (!year) {
      res.status(400).send({ message: 'year is required' });
      return;
    }
    if (!abstract) {
      res.status(400).send({ message: 'abstract is required' });
      return;
    }
    if (!program) {
      res.status(400).send({ message: 'program is required' });
      return;
    }
    if (!university) {
      res.status(400).send({ message: 'university is required' });
      return;
    }
    const etdFileId = crypto.randomUUID();

    // File upload
    const fileUploadStatus = await uploadFilesToCloud(req, res, etdFileId);

    if (typeof fileUploadStatus.status !== 'boolean') {
      return fileUploadStatus;
    }

    const filteredAnnotations = await wikifierTerms(abstract);

    const etdBody = {
      author,
      text: abstract,
      advisor,
      degree,
      program,
      title,
      university,
      year,
      etd_file_id: etdFileId,
      pdf: fileUploadStatus.fileURL,
      wikifier_terms: filteredAnnotations,
    };

    const esConfig = {
      method: 'post',
      url: `http://localhost:9200/digi_wiki/_doc/${etdFileId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios({
      ...esConfig,
      data: etdBody,
    });

    console.log('UUID', etdBody);
    return res.status(200).send({ message: 'Pdf uploaded And data indexed in ELastic Search' });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

const wikifierTerms = async (abstract) => {
  const data = qs.stringify({
    ...ES_CONFIG,
    text: abstract,
  });

  const response = await axios({
    ...wikifier_config,
    data,
  });

  const { annotations } = response.data;

  return annotations.map((annotation) => ({
    term: annotation.title,
    url: annotation.url,
  }));
};

const uploadFilesToCloud = async (req, res, etdFileId) => new Promise((resolve, reject) => {
    if (req.files?.length > 1) {
      reject(res.status(400).send({ message: 'Single file upload is supported thus far!' }));
    }

    const fileToUpload = req.files[0];
    try {
      if (!fileToUpload) {
        reject(res.status(400).send({ message: 'Please upload a file!' }));
      }
      // await processFile(req, res);

      // Create a new blob in the bucket and upload the file data.
      const blob = bucket.file(etdFileId);

      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on('error', (err) => {
        console.log('blobStream.on(error', err);
        reject(res.status(500).send({ message: err.message }));
      });

      blobStream.on('finish', async (data) => {
        // Create URL for directly file access via HTTP.
        const publicUrl = format(`https://storage.cloud.google.com/${bucket.name}/${blob.name}`);

        console.log(`Uploaded the file successfully: ${  etdFileId}`);

        resolve({
          status: true,
          fileURL: publicUrl,
        });
      });
      blobStream.end(fileToUpload.buffer);
    } catch (err) {
      if (err instanceof multer.MulterError) {
        res.status(500).send({
          message: `Multer error, Could not upload the file: ${etdFileId}. ${err}`,
        });
        // A Multer error occurred when uploading.
      } else if (err) {
        // An unknown error occurred when uploading.
        res.status(500).send({
          message: `Could not upload the file: ${etdFileId}. ${err}`,
        });
      }
    }
  });

module.exports = router;
