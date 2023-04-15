const $mensaje = document.querySelector('#mensaje');
const $btnSend = document.querySelector('#btn-send');
const $respuesta = document.querySelector('#respuesta');
const $clearContext = document.querySelector('#clear-context');

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
  
  var payload = { clearContext: $clearContext.checked, message: $mensaje.value };
  $clearContext.checked = false;
  // si quieres olvidar la conversacion agregas la propiedad "clearContext" al cuerpo de la solicitud con valor "true"
  const res = await fetch('https://apibotresponde.onrender.com/talk', {
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
