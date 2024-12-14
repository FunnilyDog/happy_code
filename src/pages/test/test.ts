onmessage = (e) => {
  console.log("e", e);
  const msg = `post-msg-${e.data}`;
  postMessage(msg);
  // self.close();
};

const Index = () => {};
export default Index;
