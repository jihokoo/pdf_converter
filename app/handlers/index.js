function render (request, reply) {
  reply.file('./app/views/index.html');
}

module.exports = {
  render: render
};
