const { v4: uuid, validate: isUuid } = require('uuid');

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid ID format.' });
  }

  return next();
}

exports.validateProjectId = validateProjectId;
