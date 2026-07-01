const FieldCard = ({ label, type, value, onChange, error }) => {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label>{label}</label>
      <br />

      <input type={type} value={value} onChange={onChange} />

      {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
    </div>
  );
};

export default FieldCard;
