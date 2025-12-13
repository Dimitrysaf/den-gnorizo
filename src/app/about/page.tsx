export default function AboutPage() {
  return (
    <div>
      <h2 className="ui header">Σχετικά με την Πλατφόρμα</h2>
      <div className="ui">
        <p>
          Η Α` Συντακτική Βουλή των Πολιτών είναι μια πλατφόρμα συμμετοχικής δημοκρατίας που επιτρέπει στους πολίτες να συμμετέχουν ενεργά στη διαμόρφωση πολιτικών.
        </p>

        <h3 className="ui header">Στόχοι</h3>
        <div className="ui bulleted list">
          <div className="item">Διαφάνεια στις αποφάσεις</div>
          <div className="item">Συμμετοχή των πολιτών</div>
          <div className="item">Δημοκρατικός διάλογος</div>
        </div>

        <h3 className="ui header">Επικοινωνία</h3>
        <p>
          Για περισσότερες πληροφορίες, επικοινωνήστε μαζί μας στο
          <a href="mailto:info@example.gr"> info@example.gr</a>
        </p>
      </div>
    </div>
  );
}