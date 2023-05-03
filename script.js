const $mensaje = document.querySelector('#mensaje');
const $btnSend = document.querySelector('#btn-send');
const $respuesta = document.querySelector('#respuesta');
const $clearContext = document.querySelector('#clear-context');
const $suggestedReplies = document.querySelector('#suggested-replies');


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
 
   $suggestedReplies.innerHTML="";
   var mensaje =($clearContext.checked)? "/" + $mensaje.value : $mensaje.value;
   $clearContext.checked = false;
   socket.send(mensaje);
   $mensaje.focus();
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
//var wsURL = "wss://hhnoqz-32767.csb.app/" 
var wsURL =('https://joselmm.github.io/poe-chat/cs.html'===location.href)?'wss://joselmm-solid-umbrella-7j9v5gv4x6wcww5r-8080.preview.app.github.dev/' : 'wss://apibotresponde-jose.onrender.com';

window.addEventListener('load', function() {
  
  console.log('La página se ha cargado completamente.');
   socket = new WebSocket(wsURL);
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
    //console.log(jsonOb);
    $respuesta.value = jsonOb.answer;
    enviando=false;
    if(jsonOb.state=="complete"){$btnSend.disabled = false;}
    incluirSugerencias(jsonOb.suggestedReplies);
  };
  
  socket.onclose = function(event) {
    console.error('Conexión cerrada');
  };
  
  
  
})

function incluirSugerencias(sugerencias) {
  if(sugerencias.length===0)return
  
  let $fragment = document.createDocumentFragment();
  for (let sug of sugerencias){
    var $btn = document.createElement("button");
    $btn.innerText=sug;
    $btn.onclick=enviarSugerencia;
    $fragment.appendChild($btn)
  }
  $suggestedReplies.innerHTML="";
  $suggestedReplies.appendChild($fragment)
}

function enviarSugerencia(e){
  console.log(e)
  e.preventDefault();
  $mensaje.value=e.target.innerText;
  $btnSend.click();
}



document.addEventListener('keydown', function(event) {
  
  var key = event.key.toLowerCase();
  //console.log(key)
  if (event.ctrlKey && event.shiftKey  && key==="control") {
    event.preventDefault(); // Evita que se ejecute el comportamiento predeterminado del navegador
    $btnSend.click(); // Hace clic en el botón con el ID 'btnSend'
  }
});
