(async function () {
  window.Flywheel.initExtension({
    scope: "ReadWrite",
    validateOrigin: (origin) =>
      origin.endsWith("flywheel.io") || origin.endsWith("octaveb.io"),
  }).then((extension) => {
    window.flywheelExtension = extension;

    const projectId = extension.container.parents.project;
    return extension
      .getContainer("project", projectId)
      .then(async (projectContainer) => {
        console.log(projectContainer);
        const { files } = projectContainer;

        const addScriptTag = (url) => {
          console.log("appending", url, "to the body");
          var s = document.createElement("script");
          s.setAttribute("src", url);
          document.body.appendChild(s);
        };

        const getFile = (name) => files.find((f) => f.name === name);

        const scriptOrder = [
          "bowser.js",
          "amazon-cognito-identity-unstable.min.js",
          "nifti-reader.js",
          "pako-inflate.js",
          "papaya.js",
          "bundle.js",
        ];
        Promise.all(
          scriptOrder.map((fileName) => {
            const file = getFile(fileName);
            console.log("fetching url of", file.name);
            return extension.getFileUrl(projectContainer, file);
          })
        ).then((urls) => urls.forEach((url) => addScriptTag(url)));
      });
  });
})();
