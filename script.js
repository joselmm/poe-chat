const $mensaje = document.querySelector('#mensaje');
const $btnSend = document.querySelector('#btn-send');
const $respuesta = document.querySelector('#respuesta');
const $clearContext = document.querySelector('#clear-context');

async function enviarMensaje() {
  //console.log($clearContext.checked)
  $btnSend.disabled = true;
  if (!$mensaje.value) {
    $btnSend.disabled = false;

    return;
  }
  var payload = { clearContext: $clearContext.checked, promt: $mensaje.value };
  $clearContext.checked = false;
  // si quieres olvidar la conversacion agregas la propiedad "clearContext" al cuerpo de la solicitud con valor "true"
  const res = await fetch('https://apibotresponde.onrender.com/talk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((res) => res);
  $respuesta.value = res.botRespuesta;
  $btnSend.disabled = false;
}
