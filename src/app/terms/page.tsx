import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="h-screen overflow-y-auto px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-zinc-300 bg-white/90 p-6 shadow-lg sm:p-8">
          <Link
            href="/"
            className="mb-6 inline-block text-sm font-medium text-zinc-600 underline hover:text-zinc-900"
          >
            Back to tuner
          </Link>

          <h1 className="mb-2 text-3xl font-bold text-zinc-900">Terms &amp; Conditions</h1>
          <p className="mb-4 text-zinc-700">
            The Legally Binding Agreement Between You, Your Guitar, and Your Questionable Musical Abilities.
          </p>
          <p className="mb-8 text-zinc-700">
            Welcome to GuitarTuner.co.za By using this website, you agree to the following terms, whether you read them or not (let&apos;s be honest, nobody reads these).
          </p>

          <section className="mb-6">
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">1. The Tuning Police</h3>
            <ul className="list-disc space-y-1 pl-6 text-zinc-700">
              <li>You agree that your guitar is probably out of tune. That&apos;s why you&apos;re here.</li>
              <li>If your guitar sounds terrible, we reserve the right to silently judge you.</li>
              <li>Blaming the tuner for your questionable playing is strictly prohibited.</li>
              <li>If you tune your guitar and it somehow sounds worse, that&apos;s between you and your guitar.</li>
              <li>We are not responsible for arguments between you and your G string.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">2. The G String Incident</h3>
            <ul className="list-disc space-y-1 pl-6 text-zinc-700">
              <li>The G string is legally recognised as the most unpredictable member of the guitar family.</li>
              <li>If it refuses to cooperate, please remain calm.</li>
              <li>We accept no responsibility for strings snapping, flying across the room, or causing emotional damage.</li>
              <li>Do not threaten the G string. It knows what it did.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">3. Musical Ability Disclaimer</h3>
            <ul className="list-disc space-y-1 pl-6 text-zinc-700">
              <li>This website can tune your guitar, but unfortunately cannot tune your personality.</li>
              <li>We cannot make you play like Jimi Hendrix.</li>
              <li>We cannot fix your inability to play barre chords.</li>
              <li>We cannot make your bandmates show up on time.</li>
              <li>We cannot guarantee that your next performance won&apos;t sound like a dying lawnmower.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">4. Technical Stuff (Unfortunately)</h3>
            <ul className="list-disc space-y-1 pl-6 text-zinc-700">
              <li>This tuner uses your microphone. By clicking allow, you agree to let us listen to your beautiful (or deeply concerning) guitar sounds.</li>
              <li>We do not intentionally record your secret guitar sessions.</li>
              <li>We are not responsible for background noises, angry parents, barking dogs, or neighbours questioning your life choices.</li>
              <li>If the tuner says you&apos;re offline, please consider reconnecting to the internet instead of blaming your guitar.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">5. Tuning at Your Own Risk</h3>
            <ul className="list-disc space-y-1 pl-6 text-zinc-700">
              <li>Tuning too aggressively may result in broken strings, broken hearts, and unexpected expenses.</li>
              <li>Please do not turn tuning pegs like you&apos;re opening a bank vault.</li>
              <li>If your guitar explodes, we strongly recommend stepping away from it.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">6. Intellectual Property</h3>
            <ul className="list-disc space-y-1 pl-6 text-zinc-700">
              <li>The tuner belongs to us.</li>
              <li>Your questionable rendition of Wonderwall belongs to you.</li>
              <li>We claim no ownership over the emotional damage caused by your open mic performances.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">7. Limitation of Liability</h3>
            <p className="mb-2 text-zinc-700">Under no circumstances shall GuitarTuner.co.za be held responsible for:</p>
            <ul className="list-disc space-y-1 pl-6 text-zinc-700">
              <li>Bad performances.</li>
              <li>Angry neighbours.</li>
              <li>Broken guitar strings.</li>
              <li>Failed auditions.</li>
              <li>Unwanted jam sessions.</li>
              <li>Being asked to play Wonderwall at a party.</li>
              <li>Your guitar sounding like it has a personal vendetta against you.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">8. Changes to These Terms</h3>
            <p className="text-zinc-700">
              We reserve the right to change these terms whenever we feel like it, especially if someone manages to break the tuner by attempting to tune a microwave.
            </p>
          </section>

          <section className="mb-6">
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">9. Final Agreement</h3>
            <p className="mb-2 text-zinc-700">By using GuitarTuner.co.za, you acknowledge that:</p>
            <ul className="list-disc space-y-1 pl-6 text-zinc-700">
              <li>Your guitar needs help.</li>
              <li>You probably need practice.</li>
              <li>The tuner is doing its best.</li>
              <li>Your G string cannot be trusted.</li>
              <li>Life is too short to play out of tune.</li>
            </ul>
          </section>

          <p className="mb-2 font-medium text-zinc-900">Congratulations!</p>
          <p className="mb-6 text-zinc-700">You are now legally (not really) obligated to tune your guitar.</p>

          <p className="text-sm text-zinc-600">Last updated: Whenever we remembered to update it.</p>
        </div>
      </div>
    </main>
  );
}
