chrome.action.onClicked.addListener(tab => { 
    const {url} = tab;
    console.log(`Loading: ${url}`); 
  });