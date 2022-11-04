export function debounce(func, timeout = 300){
    let timer;
    return function(...args) {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }