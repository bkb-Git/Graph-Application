const Loader = () => {
  return (
    <div
      class="d-flex text-primary justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
