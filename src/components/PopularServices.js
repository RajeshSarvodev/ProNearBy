function PopularServices() {
  return (
    <section>
      <h3>Popular Services</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '15px' }}>
        <div style={{ flex: '1 1 150px', padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '6px', textAlign: 'center' }}>Electricians</div>
        <div style={{ flex: '1 1 150px', padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '6px', textAlign: 'center' }}>Plumbers</div>
        <div style={{ flex: '1 1 150px', padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '6px', textAlign: 'center' }}>Tutors</div>
        <div style={{ flex: '1 1 150px', padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '6px', textAlign: 'center' }}>CCTV / IT</div>
      </div>
    </section>
  );
}

export default PopularServices;
