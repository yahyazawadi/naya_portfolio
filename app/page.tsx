export default function Home() {
  return (
    <div className="relative w-full bg-[#0B1D32]">
      {/* ═══════════════════════════════════════════════
          SECTION 1 — City skyline (Main Background)
          Overflows to the left, slightly larger than viewport.
          ═══════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden z-0">
        <div className="relative w-[110%] -left-[5%]">
          <img
            src="/images/city.webp"
            alt="City Background"
            className="w-full h-auto block"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Clouds + Character + Vectors
          Pulled MUCH HIGHER UP to overlap the city more.
          ═══════════════════════════════════════════════ */}
      <div className="relative w-full -mt-[45vw] md:-mt-[40vw] lg:-mt-[35vw] z-10 overflow-hidden">
        {/* Upper cloud layer */}
        <img
          src="/images/cloud_up.png"
          alt=""
          className="relative w-full h-auto block z-10"
        />

        {/* Lower cloud layer — pulled up even more */}
        <img
          src="/images/cloud_down.png"
          alt=""
          className="relative w-full h-auto block z-10 -mt-[12vw]"
        />

        {/* ── Character + Vectors overlay ── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none pt-[10vw]">
          {/* Vectors (circles) */}
          <img
            src="/vectors/mainpagebackgroundcirclescopy.png"
            alt=""
            className="absolute w-[140%] min-w-[1500px] h-auto opacity-90"
          />
          {/* Naya herself */}
          <img
            src="/images/nayaherself.png"
            alt="Naya"
            className="relative w-[60%] max-w-[850px] h-auto z-10"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — Intro text
          Raised much higher up towards the character.
          ═══════════════════════════════════════════════ */}
      <div className="relative z-30 text-center px-6 -mt-[10vw] pb-20">
        <p className="font-sans text-white text-base md:text-lg lg:text-xl font-normal leading-relaxed tracking-wide max-w-[700px] mx-auto">
          Hi, I&apos;m{" "}
          <span className="font-accent text-[2.2em] md:text-[2.5em] text-[#3FE2FF] align-middle px-1 leading-none">
            Naya
          </span>
          ! I&apos;m a digital &amp; traditional artist,
          <br />
          illustrator, graphic designer and animator.
        </p>
      </div>
    </div>
  );
}
