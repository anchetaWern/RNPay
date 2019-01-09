import axios from 'axios';

const endpoint = 'https://YOUR_NGROK_URL/charge';

const pay = async (amount, description, access_token, token_id) => {
	const data = {
    'amount': amount,
    'description': description,
    'access_token': access_token,
    'token_id': token_id
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  let response = false;
  try {
  	let charge_response = await axios.post(endpoint, data, { headers });
  	console.log("==PERFECT AS FOUR==");
  	console.log(charge_response.data);
    if(charge_response.data.status == 'ok'){
      response = true;
    }
  } catch (e) {
  	console.log('server error: ', e);
  }

  return response;

}

export default pay;