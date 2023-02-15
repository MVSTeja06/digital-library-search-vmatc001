# pylint: disable=invalid-name
# pylint: disable=trailing-whitespace
import csv 
import json 
#import requests
import collections
import urllib.parse
import urllib.request
orderedDict = collections.OrderedDict()
# from collections import OrderedDict


def CallWikifier(text, lang="en", threshold=0.8):
    # Prepare the URL.
    data = urllib.parse.urlencode([
        ("text", text), ("lang", lang),
        ("userKey", "ajfykkzodmgidqavxtiyyeololqwux"),
        ("pageRankSqThreshold", "%g" % threshold), ("applyPageRankSqThreshold", "true"),
        ("nTopDfValuesToIgnore", "200"), ("nWordsToIgnoreFromList", "200"),
        ("wikiDataClasses", "true"), ("wikiDataClassIds", "false"),
        ("support", "true"), ("ranges", "false"), ("minLinkFrequency", "2"),
        ("includeCosines", "false"), ("maxMentionEntropy", "3")
        ])
    url = "http://www.wikifier.org/annotate-article"
    # Call the Wikifier and read the response.
    req = urllib.request.Request(url, data=data.encode("utf8"), method="POST")
    with urllib.request.urlopen(req, timeout = 60) as f:
        response = f.read()
        response = json.loads(response.decode("utf8"))

    # print("response", response)
    return list(filter(lambda x: dict( term= x["title"], url = x["url"] ), response["annotations"]))    
    
    # for annotation in response["annotations"]:
    #     print("%s (%s)" % (annotation["title"], annotation["url"]))


def make_json(csvFilePath1, jsonFilePath1):
    # jsonArray = []
    data = {}
    # jsonString = json.dumps(x)  
    with open(csvFilePath1, encoding='utf-8') as csvf: 
        csvReader = csv.DictReader(csvf)

        # Convert each row into a dictionary
        # and add it to data
        for rows in csvReader:

            data = rows
            
            # data["wikifier_terms"] = CallWikifier(rows["text"]) 
            
    with open(jsonFilePath1, 'w', encoding='utf-8') as jsonf:
        csvReader = csv.DictReader(csvf) 
            
        y = json.dumps(data, indent=4)
        jsonf.write(y)
          
csvFilePath = r'metadata_abstract.csv'
jsonFilePath = r'metadata_abstract_wikifier1.json'
make_json(csvFilePath, jsonFilePath)