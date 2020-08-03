/**
 * Fetch with timeout.
 *
 * Small wrapper function to make fetch requests with a timeout.
 *
 * @module  TimeoutFetch
 * @file    Wrapper function to fetch with a timeout
 * @author  syoung908
 * @since   1.0.0
 * @version 1.0.0
 */

import 'abortcontroller-polyfill';
import "regenerator-runtime/runtime";

/** 
 * timeoutFetch. 
 *
 * Calls fetch with the given parameters and a timeout in the case the server 
 * does not respond or a network error has occurred.  
 * 
 * @since 1.0.0
 * 
 * @param  {String}  url        A string containing the url to fetch from.
 * 
 * @param  {String}  method     The HTTP request method to be performed.
 *                              (GET, POST, PUT, DELETE, ...)
 * 
 * @param  {Object}  postbody   (OPTIONAL) An object that will be the body of 
 *                              a POST request. A non-null body is assumed to be
 *                              a POST request. 
 * 
 * @param  {Number}  timeout    The number of milliseconds to wait before the 
 *                              request will be aborted and return an ABORTERROR
 * 
 * @return {Promise<Object>}  A promise that will resolve upon a response from 
 *                            the destination 
 */
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