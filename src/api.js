import axios from "axios";

// axios.defaults.baseURL = 'http://localhost:5000'
// axios.defaults.baseURL = 'https://ctc-web-291704.ue.r.appspot.com/'
axios.defaults.baseURL = '/api/'


// axios.interceptors.request.use(
//   config => {
//     // console.log('axios')
//     if (!config.headers.Authorization) {
//       // const token = localStorage.getItem('token')
//       const token = sessionStorage.getItem('token')
//       // console.log(token)
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     // console.log('config', config.headers.Authorization)
//     return config;
//   },
//   error => Promise.reject(error)
// )


export const testget = (callback, catchback) => 
  axios.get('/')
    .then(response => callback(response.data))
    .catch(error => catchback(error))

export const testUpload = (data, callback, catchback) => 
  axios.post('/upload', data)
    .then(response => callback(response.data))
    .catch(error => catchback(error))

// export const register = (email, password) => 
export const register = (email, password, callback, catchback) => 
  axios.post('/users', {
    email: email,
    password: password
  })
  .then(response => callback(response))
  .catch(error => catchback(error))
  // .then(() => console.log('registered'))
  // .catch(error => console.log('register failed', error))

export const forgot = (email, callback, catchback) => 
  axios.put('/users/resetbyemail', {
    email: email,
  })
  .then(response => callback(response.data))
  .catch(error => catchback(error))

export const resetPassword = (email, password, newPassword, callback, catchback) => 
  axios.put('/users/resetbypassword', {
    email: email,
    password: password,
    newpassword: newPassword
  })
  .then(response => callback(response.data))
  .catch(error => catchback(error))