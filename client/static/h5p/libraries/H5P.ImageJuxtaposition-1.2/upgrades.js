/** @namespace H5PUpgrades */
var H5PUpgrades = H5PUpgrades || {};

H5PUpgrades['H5P.ImageJuxtaposition'] = (function () {
  return {
    1: {
      2: function (parameters, finished, extras) {

        var hasMetadataTitle = (extras && extras.metadata && extras.metadata.title);

        finished(null, parameters, {
          metadata: {
            title: hasMetadataTitle ? extras.metadata.title : parameters.title
          }
        });
      }
    }
  };
})();
