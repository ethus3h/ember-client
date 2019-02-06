window.addEventListener('message', function(message) {
    canEdit=message[0];
    contents=message[1];
    console.log(message);
});
