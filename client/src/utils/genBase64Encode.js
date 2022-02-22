const generateBase64Encode = (file, setValue, isSetState, type = 'image') => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    if (isSetState) {
      setValue(reader.result);
    } else if (type === 'video') {
      setValue('videoSubmission', reader.result);
    } else {
      setValue('imageSubmission', reader.result);
    }
  };
};

export default generateBase64Encode;
