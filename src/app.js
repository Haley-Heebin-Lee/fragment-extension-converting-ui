import { Auth, getUser } from './auth';
import { getUserFragments, getFragments, postFragments, getByIdFragment, getByIdInfoFragment, deleteFragment, updateFragment } from './api';
//import { disable } from 'express/lib/application';
//import TextareaMarkdown from 'textarea-markdown'

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const getBtn = document.getElementById("getBtn");
  const getExtendedBtn = document.getElementById("getExtendedBtn");
  const postBtn = document.getElementById("postBtn");
  const getbyidBtn = document.getElementById("getbyidBtn");
  const dataReceived = document.getElementById("dataReceived");
  const getbyidInfoBtn = document.getElementById("getbyidInfoBtn");
  const deleteBtn = document.getElementById("delete");
  const updateBtn = document.getElementById("update");
  const inputFile = document.getElementById('inputFile');
  

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

 // Do an authenticated request to the fragments API server and log the result
 await getUserFragments(user);

  // Log the user info for debugging purposes
  console.log({ user });

  

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  getBtn.onclick = async () => {
    console.log('get button clicked');
    dataReceived.innerHTML = '';
    await getUserFragments(user);
  }
  
  getExtendedBtn.onclick = async () => {
    console.log('extended get button clicked');
    dataReceived.innerHTML = '';
    await getFragments(user, 1);
  }

  postBtn.onclick = async () =>{
    dataReceived.innerHTML = '';
    let type = document.querySelector('#types').value;
    let data = document.querySelector('#data').value;
    
    if(data){
      console.log('POST data sent', {data});
      await postFragments(user, data, type);
    }else{
      let image = inputFile.files[0];
      await postFragments(user, image, type);
    }

  }

  getbyidBtn.onclick = async () =>{
    dataReceived.innerHTML = '';
    var id = document.querySelector('#givenId').value;
    console.log('GET/:id id sent', {id});
    await getByIdFragment(user, id);
  }

  getbyidInfoBtn.onclick = async () => {
    dataReceived.innerHTML = '';
    var id = document.querySelector('#givenId').value;
    console.log('GET/:id/info id sent', {id});
    await getByIdInfoFragment(user, id);

  }

  deleteBtn.onclick = async () => {
    dataReceived.innerHTML = '';
    var id = document.querySelector('#givenId').value;
    console.log('DELETE/:id sent', {id});
    await deleteFragment(user, id);
  }

  updateBtn.onclick = async () => {
    dataReceived.innerHTML = '';
    var id = document.querySelector('#givenId').value;
    let type = document.querySelector('#types').value;
    let data = document.querySelector('#data').value;
    if(data){
      console.log('PUT/:id sent', {id});
      await updateFragment(user, data, id, type);
    }else{
      let image = inputFile.files[0];
      await updateFragment(user, image, id, type);
    }

  }


}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);