function SearchBar() {
  return (
    <section style={{ marginBottom: '30px' }}>
      <input
        type="text"
        placeholder="Enter your location or service"
        style={{
          width: '60%',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          marginRight: '10px'
        }}
      />
      <button style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>Search</button>
    </section>
  );
}

export default SearchBar;
