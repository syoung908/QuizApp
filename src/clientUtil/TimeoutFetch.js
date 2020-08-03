import 'abortcontroller-polyfill';
import "regenerator-runtime/runtime";

//30000
export const timeoutFetch = (url, method, postbody, timeout = 30000) => {
  const controller = new AbortController();
  const signal = controller.signal;

  require('es6-promise').polyfill();
  require('isomorphic-fetch');

  const fetchPromise = (postbody)
    ? fetch(url, {
        crossDomain: true,
        method: 'POST', 
        body: JSON.stringify(postbody), 
        signal: signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      })
    : fetch(url, {method: method, signal: signal})

  setTimeout(() => controller.abort(), timeout);

  return(fetchPromise);
}


export const serverRequest = async(url, method, postbody, action, finalAction) => {
  try {
    const response = await timeoutFetch(url, method, postbody);
    const datajson = await response.json();
    if (response.status === 200) {
      if (action) action(datajson);
    } else {
      console.error("Error status: " + response.status + datajson);
    }
  } catch(err) {
    console.error(err);
  } finally{
    if (finalAction) finalAction();
  }
}