console.log("index.js line #1");

(async function () {
  window.Flywheel.initExtension({
    scope: "ReadWrite",
    validateOrigin: (origin) => origin.endsWith("flywheel.io"),
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
        for (const fileName of scriptOrder) {
          const file = getFile(fileName);
          console.log("fetching url of", file.name);
          const url = await extension.getFileUrl(projectContainer, file);
          addScriptTag(url);
        }
      });
  });
})();
