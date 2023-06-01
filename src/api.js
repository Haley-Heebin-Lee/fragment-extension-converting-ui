// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';
const dataReceived = document.getElementById("dataReceived");
const imageReceived = document.querySelector('img');
/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
      //Authorization: `Bearer ${user.idToken}`,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });

    dataReceived.innerHTML = typeof data === 'object' ? JSON.stringify(data.fragments) : data;

  } catch (err) {
    console.error(`Unable to call GET /v1/fragment}`, { err });
  }
}

export async function getFragments(user, expand = 0) {
  console.log('Getting fragments data...');
  imageReceived.src = "";
  try {
    const resGet = await fetch(`${apiUrl}/v1/fragments/?expand=${expand}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
      //Authorization: `Bearer ${user.idToken}`,
    });
    if (!resGet.ok) {
      throw new Error(`${resGet.status} ${resGet.statusText}`);
    }
    const dataFrag = await resGet.json();
    console.log('Got fragments data', { dataFrag });
  
    dataReceived.innerHTML = typeof dataFrag === 'object' ? JSON.stringify(dataFrag.fragments) : dataFrag;
  
  } catch (err) {
    console.error(`Unable to call GET /v1/fragment/?expand=${expand}`, { err });
  }
}



export async function postFragments(user, frag, type) {
  console.log('Posting fragment data...');
  imageReceived.src = "";
  try {
    const resPost = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers:{
        Authorization: `Bearer ${user.idToken}`,
        'Content-Type': type,
      },
      //headers: user.authorizationHeaders(type),
      body: frag,
    });
    if (!resPost.ok) {
      throw new Error(`${resPost.status} ${resPost.statusText}`);
    }
    const dataPost = await resPost.json();
    console.log(`${process.env.API_URL}/v1/fragments`);
    console.log('Write user fragments data', { dataPost });
    dataReceived.innerHTML = "Successfully saved fragment";
    
  } catch (err) {
    console.error('Unable to write POST /v1/fragment', { err });
  }

}

export async function getByIdFragment(user, id) {
  console.log('getting fragment data by id...');
  imageReceived.src = "";
  try {
    if(id != ""){
      const resId = await fetch(`${apiUrl}/v1/fragments/${id}`, {
       headers: user.authorizationHeaders(),
      });
  
      if (!resId.ok) {
        throw new Error(`${resId.status} ${resId.statusText}`);
      }
      const type = resId.headers.get("Content-Type");
      
      if(type.startsWith('text/html')){
        const dataById = await resId.text();
        dataReceived.insertAdjacentHTML('afterbegin', dataById);
        console.log('data got by id:', dataById);
      }else if(type.startsWith('image/')){
        const imgData = await resId.blob();
        var objectURL = URL.createObjectURL(imgData);
        imageReceived.src = objectURL;

      }else{ // other text/ and application/json
        const dataById = await resId.text();
        dataReceived.innerHTML = typeof dataById === 'object' ? JSON.stringify(dataById.fragment) : dataById;
        console.log('data got by id:', dataById);
      }
    }else{
      console.log('id is empty');
    }
  } catch (err) {
    console.error(`Unable to Get by id /v1/fragment/${id}`, { err });
  }
}

  export async function getByIdInfoFragment(user, id) {
    console.log('Getting fragment metadata by id...');
    imageReceived.src = "";
    try {
      if(id != ""){
        const resInfo = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
         headers: user.authorizationHeaders(),
        });
    
        if (!resInfo.ok) {
          throw new Error(`${resInfo.status} ${resInfo.statusText}`);
        }
        const dataByIdInfo = await resInfo.json();
        console.log('metadata got by id:', dataByIdInfo);
  
        dataReceived.innerHTML = typeof dataByIdInfo === 'object' ? JSON.stringify(dataByIdInfo.fragment) : dataByIdInfo;
      }else{
        console.log('id is empty');
      }
    } catch (err) {
      console.error(`Unable to Get by id /v1/fragment/${id}/info`, { err });
    }
  

}

export async function deleteFragment(user, id) {
  console.log('deleting fragment by id...');
  imageReceived.src = "";
  try {
      const resId = await fetch(`${apiUrl}/v1/fragments/${id}`, {
        method: 'DELETE',
        headers: user.authorizationHeaders(),
      });
  
      if (!resId.ok) {
        throw new Error(`${resId.status} ${resId.statusText}`);
      }
      console.log('data deleted');
  } catch (err) {
    console.error(`Unable to delete ${id}`, { err });
  }
}

export async function updateFragment(user, frag, id, type) {
  console.log('Updating fragment data...');
  imageReceived.src = "";
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        'Content-Type': type,
      },
      body: frag,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`${process.env.API_URL}/v1/fragments`);
    console.log('Updated fragments data', { data });
    dataReceived.innerHTML = "Successfully updated fragment";
  } catch (err) {
    console.error('Unable to call PUT /v1/fragments', { err });
  }
}