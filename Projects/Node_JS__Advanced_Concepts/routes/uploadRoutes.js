const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: keys.awsAccessKeyId,
        secretAccessKey: keys.awsSecretAccessKey,
    },
    region: 'us-west-2',
});

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {
        let key = `${req.user.id}/${uuid()}.jpeg`;

        s3.getSignedUrl('putObject', {
          Bucket: 'advnode',
          ContentType: 'image/jpeg',
          Key: key,
        }, (err, url) => res.send({ key, url }));
    })
}

