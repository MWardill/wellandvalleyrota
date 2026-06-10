export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8 text-base-content">

      <div>
        <h2 className="font-display text-2xl text-primary mb-2">How to Use This Rota</h2>
        <p>This website helps you sign up to steward at Welland Valley Art Society Exhibitions. Here&apos;s everything you need to know.</p>
      </div>

      <section>
        <h3 className="font-display text-lg text-primary mb-1">Booking a shift</h3>
        <p>Go to the <strong>Book a Shift</strong> tab. You&apos;ll see the exhibition dates listed — simply find a day that suits you, choose a morning, afternoon or evening slot, click on <em>&lsquo;Sign up&rsquo;</em>, enter your name and phone number, and press <strong>Book</strong>. You&apos;ll see a confirmation message when it&apos;s done. That&apos;s all there is to it!</p>
      </section>

      <section>
        <h3 className="font-display text-lg text-primary mb-1">Cancelling a shift</h3>
        <p>Go to the <strong>Book a Shift</strong> tab and find the date of the shift you want to cancel. Click the <em>&lsquo;Cancel&rsquo;</em> button adjacent to your name. Please only cancel your own bookings.</p>
      </section>

      <section>
        <h3 className="font-display text-lg text-primary mb-1">Checking who&apos;s booked</h3>
        <p>The <strong>Who&apos;s Booked</strong> tab shows a list of everyone who has signed up, along with which shifts they&apos;re covering. This is useful if you want to see who you&apos;ll be stewarding alongside.</p>
      </section>

      <section>
        <h3 className="font-display text-lg text-primary mb-1">The full overview</h3>
        <p>The <strong>Full Overview</strong> tab shows the entire exhibition as a grid — every day and every shift — so you can see at a glance which slots are taken, and which still need a steward.</p>
      </section>

      <section>
        <h3 className="font-display text-lg text-primary mb-1">A note on phone numbers</h3>
        <p>Just type your number as you normally would — with or without spaces. For example, either <code className="bg-base-200 px-1 rounded text-sm">07700 123456</code> or <code className="bg-base-200 px-1 rounded text-sm">07700123456</code> is fine. If there is a reason that you cannot provide a phone number, then please type <em>&lsquo;none&rsquo;</em> or <em>&lsquo;N/A&rsquo;</em> or something similar.</p>
      </section>

      <section>
        <h3 className="font-display text-lg text-primary mb-1">Note to Exhibitors</h3>
        <p>The expected requirement is that each exhibiting member will cover a minimum of two (2) shifts during the exhibition period.</p>
      </section>

      <section>
        <h3 className="font-display text-lg text-primary mb-1">Need help?</h3>
        <p>
          If anything isn&apos;t working, you&apos;re not sure what to do, or wish to discuss your availability, please get in touch with Keith Aldridge.{" "}
          <a
            href="mailto:keith.aldridge306@gmail.com"
            className="text-secondary underline underline-offset-2 hover:text-secondary/80"
          >
            Click here to message Keith
          </a>.
        </p>
      </section>

    </div>
  );
}
