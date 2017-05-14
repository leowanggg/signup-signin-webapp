/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  schema: true,

  attributes: {
      name: {
          type: 'string',
          required: true
      },

      title: {
          type: 'string'
      },

      email: {
          type: 'string',
          email: true,
          required: true,
          unique: true
      },

      admin: {
          type: 'boolean',
          defaultsTo: false
      },

      encryptedPassword: {
          type: 'string'
      },

      online: {
          type: 'boolean',
          defaultsTo: false
      },

      toJSON: function(){
          var obj = this.toObject();
          delete obj.password;
          delete obj.confirmation;
          delete obj.encryptedPassword;
          delete obj._csrf;
          return obj;
      }
  },

  beforeCreate: function(values, next){
      //check and make sure that the password and password confirmation match before creating record
      if (!values.password || values.password != values.confirmation) {
          return next({err: ["密码和验证密码不匹配"]});
      }

      require('bcryptjs').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
          if (err) return next(err);
          values.encryptedPassword = encryptedPassword;
        //   values.online = true;
          next();
      });
  }
};
