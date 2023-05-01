const $mensaje = document.querySelector('#mensaje');
const $btnSend = document.querySelector('#btn-send');
const $respuesta = document.querySelector('#respuesta');
const $clearContext = document.querySelector('#clear-context');
var POE_ENDPOINT = "https://apibotresponde-jose.onrender.com/talk";
enviando = false;

async function enviarMensaje() {
  //console.log($clearContext.checked)
  if(enviando)return;
  enviando=true;
  $btnSend.disabled = true;
  
  if (!$mensaje.value) {
    $btnSend.disabled = false;
    enviando=false;
    return;
  }
 
   var mensaje =($clearContext.checked)? "/" + $mensaje.value : $mensaje.value;
   $clearContext.checked = false;
   socket.send(mensaje);
}
/*
async function enviarMensaje() {
  //console.log($clearContext.checked)
  if(enviando)return;
  enviando=true;
  $btnSend.disabled = true;
  
  if (!$mensaje.value) {
    $btnSend.disabled = false;
    enviando=false;
    return;
  }
  
  var payload = { clearContext: $clearContext.checked, message: $mensaje.value };
  $clearContext.checked = false;
  // si quieres olvidar la conversacion agregas la propiedad "clearContext" al cuerpo de la solicitud con valor "true"
  const res = await fetch(POE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((res) => res);
   if(!res.noError){
    $respuesta.value = res.message;
     return
  };
  $respuesta.value = res.botRespuesta;
  $btnSend.disabled = false;
  enviando = false;
}
*/
var wsURL = "wss://hhnoqz-8081.csb.app/" || 'wss://apibotresponde-jose.onrender.com';
var socket = new WebSocket(wsURL);
socket.onopen = function(event) {
  console.log('Conexión establecida con '+wsURL);
};

socket.onmessage = function(event) {
  //console.log('Mensaje recibido: ' + event.data);
  if(event.data.charAt(0)!="{"){
    $respuesta.value = event.data;  
    return
  }
  var jsonOb = JSON.parse(event.data);
  console.log(jsonOb.state);
  $respuesta.value = jsonOb.answer;
  enviando=false;
  if(jsonOb.state=="complete"){$btnSend.disabled = false;}
};

socket.onclose = function(event) {
  console.error('Conexión cerrada');
};
