import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="ui" style={{ minHeight: '400px', textAlign: 'center', padding: '80px 40px' }}>
      <div className="ui icon header">
        <i className="search icon"></i>
        <div style={{ fontSize: '2.5rem', margin: '20px' }}>404</div>
        Η σελίδα δεν βρέθηκε
      </div>
      <p style={{ fontSize: '1.1rem', color: '#767676', marginTop: '20px' }}>
        Η σελίδα που ζητήσατε δεν υπάρχει ή έχει μετακινηθεί.
      </p>
      <div style={{ marginTop: '40px' }}>
        <Link href="/" className="ui large primary button">
          <i className="home icon"></i>
          Επιστροφή στην Αρχική
        </Link>
      </div>
    </div>
  );
}