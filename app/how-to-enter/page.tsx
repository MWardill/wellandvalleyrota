import Link from "next/link";

export default function HowToEnterPage() {
  return (
    <div id="top" className="max-w-2xl mx-auto py-6 space-y-10 text-base-content">

      <div>
        <h2 className="font-display text-2xl text-primary mb-2">How to Enter — Exhibition Guidelines &amp; Conditions of Entry</h2>
        <p>Please read this before completing your on-line entry form.</p>
      </div>

      <div className="bg-base-200 border border-base-300 rounded-lg p-4">
        <p className="font-display italic text-lg mb-3">
          Autumn Exhibition 2026
          <span className="block not-italic text-sm text-base-content/70 mt-1">
            Stamford Arts Centre, St Mary&apos;s Street, Stamford — 29 September to 17 October
          </span>
        </p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-base-content/70">Deadline to enter</dt>
          <dd className="font-mono tabular-nums">Fri 18 Sep</dd>
          <dt className="text-base-content/70">Hand-in of artworks</dt>
          <dd className="font-mono tabular-nums">Mon 28 Sep, 9.30–10.30am</dd>
          <dt className="text-base-content/70">Collect work not selected</dt>
          <dd className="font-mono tabular-nums">Mon 28 Sep, 1–3pm</dd>
          <dt className="text-base-content/70">Private preview</dt>
          <dd className="font-mono tabular-nums">Tue 29 Sep, 7–9pm</dd>
          <dt className="text-base-content/70">Collect unsold work</dt>
          <dd className="font-mono tabular-nums">Mon 19 Oct, 9am–12pm</dd>
        </dl>
        <p className="mt-4 pt-4 border-t border-dashed border-base-300 text-sm text-base-content/70">
          Exhibitions are put on by committee and member volunteers — any help on Hand-In day, Collection day or at the
          Private Preview keeps this exhibition going. If you can help, email Shani Wray-Jenkins at{" "}
          <a href="mailto:wvas_exhibition@yahoo.com" className="text-secondary underline underline-offset-2 hover:text-secondary/80">
            wvas_exhibition@yahoo.com
          </a>.
        </p>
      </div>

      <nav aria-label="Page index" className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
        <div>
          <h4 className="uppercase tracking-wide text-xs text-base-content/60 mb-2">How to Enter</h4>
          <ol className="space-y-1">
            <li><a href="#submit-form" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Submit your on-line entry form</a></li>
            <li><a href="#entry-fee" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Entry fee</a></li>
            <li><a href="#deliver" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Deliver your work</a></li>
            <li><a href="#collect-unselected" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Collect unselected work</a></li>
            <li><a href="#collect-unsold" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Collect unsold work</a></li>
          </ol>
        </div>
        <div>
          <h4 className="uppercase tracking-wide text-xs text-base-content/60 mb-2">Conditions of Entry</h4>
          <ol className="space-y-1">
            <li><a href="#stewarding" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Stewarding</a></li>
            <li><a href="#accepted-media" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Accepted media</a></li>
            <li><a href="#number-of-entries" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Number of entries</a></li>
            <li><a href="#small-affordable" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Small affordable art</a></li>
            <li><a href="#browsers" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Browsers</a></li>
            <li><a href="#framing" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Framing</a></li>
            <li><a href="#prints" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Prints</a></li>
            <li><a href="#labelling" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Labelling</a></li>
            <li><a href="#sculpture-labels" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Sculpture labels</a></li>
            <li><a href="#certification" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Certification, copyright &amp; photography</a></li>
            <li><a href="#sales" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Sales</a></li>
            <li><a href="#loss-damage" className="text-secondary underline underline-offset-2 hover:text-secondary/80">Loss &amp; damage liability</a></li>
          </ol>
        </div>
      </nav>

      <div className="space-y-6">
        <div>
          <p className="uppercase tracking-wide text-xs text-secondary mb-1">Part One</p>
          <h2 className="font-display text-2xl text-primary">How to Enter</h2>
        </div>

        <section id="submit-form" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Submit your on-line entry form</h3>
          <p>A link to the online entry form will be sent to you by email, and will also be available in the Exhibitor&apos;s section of the WVAS website. Ensure you click <strong>Submit</strong> at the very bottom of the form.</p>
          <div className="bg-base-200 border-l-4 border-secondary rounded p-3 text-sm space-y-2">
            <p>The form goes live <strong>Sunday 23rd August</strong> and closes <strong>Friday 18th September</strong>.</p>
            <p>
              If you change your entry, you <strong>must</strong> notify the Membership Secretary,{" "}
              <a href="mailto:WVASMembersec@gmail.com" className="text-secondary underline underline-offset-2 hover:text-secondary/80">
                WVASMembersec@gmail.com
              </a>, with details of the change before entries close.
            </p>
          </div>
          <p>After submitting, you should see a confirmation pop-up, followed by an email receipt before the closing date. If either is missing, contact the Membership Secretary at the address above.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="entry-fee" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Entry fee</h3>
          <p>The entry fee of <strong>£10</strong> must be paid at the time of entry, via the link on the form.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="deliver" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Deliver your work</h3>
          <p>Hand-in is <strong>Monday 28th September, 9.30–10.30am</strong>, at the Arts Centre, St Mary&apos;s Street, Stamford.</p>
          <p>Check your First Choice against the information at check-in — any work used for marketing is automatically designated your First Choice.</p>
          <p>Bring a separate list of any browser items, showing your name, titles and prices. When handing in work, make sure we have your name and phone/email, in case you have unselected pieces to collect.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="collect-unselected" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Collect unselected work</h3>
          <p>Non-selected work must be collected between <strong>1pm and 3pm, Monday 28th September</strong>. If you can&apos;t collect it yourself, arrange for someone else to.</p>
          <p>The Art Centre cannot store uncollected work, so any damage to it becomes the artist&apos;s responsibility. Please make sure we have your name and phone/email.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="collect-unsold" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Collect unsold work</h3>
          <p>Exhibitors <strong>must</strong> collect unsold work between <strong>9am and 12noon, Monday 19th October</strong>. Arriving outside this window creates problems for the volunteers closing the exhibition — please don&apos;t remove any work without first checking it out with a WVAS volunteer at the stewarding desk.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>
      </div>

      <div className="space-y-6">
        <div>
          <p className="uppercase tracking-wide text-xs text-secondary mb-1">Part Two</p>
          <h2 className="font-display text-2xl text-primary mb-1">Conditions of Entry</h2>
          <p className="text-base-content/70 text-sm">Submitting work to the exhibition implies acceptance of the conditions below — please read them.</p>
        </div>

        <section id="stewarding" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Stewarding</h3>
          <p>
            <Link href="/help" className="text-secondary underline underline-offset-2 hover:text-secondary/80">
              Book stewarding on the rota
            </Link>{" "}
            for the Autumn 2026 exhibition. The rota goes live <strong>Sunday 23rd August</strong>, and is also available in the Members&apos; section of the WVAS website.
          </p>
          <div className="bg-base-200 border-l-4 border-secondary rounded p-3 text-sm">
            <p><strong>Stewarding is mandatory</strong> for all members as a condition of entering work. Every exhibitor must steward a minimum of <strong>3 separate time slots</strong> — we need at least two people per session to cover the whole exhibition. Friends and partners are welcome to help, and offers of extra duties are always welcome.</p>
          </div>
          <p>If you haven&apos;t pre-booked your slots by Hand-In, bring your diary with a few dates in mind — Keith Aldridge will be on hand to book slots for you.</p>
          <p>
            Full stewarding details are on{" "}
            <a href="https://www.wellandvalleyartsociety.co.uk" className="text-secondary underline underline-offset-2 hover:text-secondary/80">
              wellandvalleyartsociety.co.uk
            </a>, in the Members&apos; area. It&apos;s your responsibility to check your slots are correct, arrange a swap if you need to change a duty, and keep your contact details up to date.
          </p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="accepted-media" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Accepted media, methods &amp; material</h3>
          <p>Pencil/graphite, metalpoint/silverpoint, pen &amp; ink, biro, felt tip, fine or compressed charcoal (including homemade sticks), chalks, pastels/oil pastels, sanguine, wax crayon, watercolour (including pencils), gouache, powder paint/tempera, acrylics, oil paint, cold wax/encaustic mediums, etching, linoprint, aquatint/mezzotint, screen print, and mixed media. Any of these may be combined with each other or with materials such as fabric, frottage and collage.</p>
          <p>3D work must be made by one of four basic processes: carving, modelling, casting or constructing. <strong>Digital printing and AI-assisted processes are not permitted.</strong></p>
          <p>Work that might fall outside this list can still be considered — contact the Secretary at least two months before the exhibition to arrange a committee review.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="number-of-entries" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Number of entries</h3>
          <p>A minimum of 2 and up to 4 works may be entered for judging — single pieces cannot be accepted. Maximum of one large piece (over 90cm in any direction, including frame), and maximum of one NFS entry.</p>
          <p>One submitted work must be designated your First Choice, and will bypass the selection panel — mark this clearly on the online form. Work used for marketing counts as First Choice.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="small-affordable" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Small affordable art</h3>
          <p>An extra work may be submitted for the Small Affordable Art section — the aim is to hang at least one piece per artist, subject to the selection panel&apos;s final say.</p>
          <p>To qualify: paintings, prints or drawings must be framed (or, for cradled panels, have outside edges) no larger than <strong>11&quot; × 9&quot; (28cm × 23cm)</strong>. Sculptures no larger than <strong>8&quot; × 8&quot; × 8&quot; (20cm)</strong>. All small works priced at <strong>£75 or less</strong>.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="browsers" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Browsers</h3>
          <p>Browser items may only be lodged by artists also submitting work to the selection panel, and are restricted to works on paper or thin card — well presented, mounted and cellophane-wrapped. Label each item on the back with artist name, title and price.</p>
          <p>Bring a separate list of all browser items (name, titles, prices) with your main pieces at hand-in. Browsers are not selected or catalogued, but normal commission applies to browser sales.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="framing" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Framing</h3>
          <p>Pictures are only accepted for selection if properly and securely framed, with a cord tightly stretched across the back using D-rings — clip frames are not acceptable. Unframed stretched canvases (no visible nails or staples, painting continued at the sides) may be accepted at the selection committee&apos;s discretion. All glazed work must use conventional picture glass — Perspex or plastic alternatives are not accepted.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="prints" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Prints</h3>
          <p>Etchings, lino prints, screen prints and collagraphs are accepted as limited editions, with a description of the print process. Machine-produced copies, such as giclée prints, will not be hung, but may be placed in the browsers.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="labelling" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Labelling</h3>
          <p>Each entry needs <strong>two labels</strong>. The first is stuck to the back of the picture, stating title, medium, price, artist&apos;s name, address and phone number.</p>
          <p>The second is used by the hanging team for the catalogue — at least 2&quot;×3&quot;, showing title and artist&apos;s name clearly, attached to the hanging wire by string or wool so it hangs visibly below the picture.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="sculpture-labels" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Sculpture labels</h3>
          <p>Label sculptures underneath, with an easily removable tag tied on.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="certification" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Certification, copyright &amp; photography of work</h3>
          <p>Entry implies certifying that each submission is the artist&apos;s own original, unaided work — not copied in whole or part from any other artist, image maker or photographer — and that it hasn&apos;t been exhibited previously at a WVAS exhibition.</p>
          <p>Copyright stays with the artist. Unless the artist states otherwise in writing, exhibited work may be photographed without fee, for use by the Society or the press in connection with the exhibition.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="sales" className="pt-4 border-t border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Sales</h3>
          <p>Commission of <strong>20%</strong> applies to all sales, whether arranged between artist and buyer or through the steward on duty — plus a further <strong>1.69%</strong> for card purchases. Paintings can&apos;t be collected until the exhibition ends; any delivery arrangement is between artist and purchaser.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>

        <section id="loss-damage" className="pt-4 border-t border-b border-base-300 space-y-2">
          <h3 className="font-display text-lg text-primary mb-1">Loss &amp; damage liability</h3>
          <p>Every possible care is taken of submitted work, but neither the Society nor Stamford Arts Centre Management is responsible for loss or damage. The gallery bar may be open — and unstewarded — at times outside our knowledge. Artists are advised to arrange their own insurance.</p>
          <p className="text-right"><a href="#top" className="text-xs text-secondary underline underline-offset-2 hover:text-secondary/80">Back to top</a></p>
        </section>
      </div>

      <p className="text-xs text-base-content/50 pt-4">
        Adapted from the printed Exhibition Guidelines &amp; Conditions of Entry, Welland Valley Art Society.
      </p>

    </div>
  );
}
