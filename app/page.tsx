import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";

const portfolioItems = [
  {
    src: "/images/DigitalArt&Illustration.webp",
    title: "Digital Art & Illustration",
    subtitle: "Using Krita, StylusX\n& Clip Studio Paint",
    href: "/digital-art",
    type: "wide",
  },
  {
    src: "/images/traditionalarts&crafts.webp",
    title: "Traditional Art & Crafts",
    subtitle: "Paintings made with Water/Acrylic colors\nClay & other craftrs",
    href: "/traditional-art",
    type: "narrow",
  },
  {
    src: "/images/illustrator&photoshop.webp",
    title: "Graphic Design",
    subtitle: "Illustrator & Photoshop",
    href: "/graphic-design",
    type: "narrow",
  },
  {
    src: "/images/Animation&MotionGraphics.webp",
    title: "Animation & Motion Graphics",
    subtitle: "Krita, Illustrator, Adobe Animate\n& Adobe After Effects",
    href: "/animation",
    type: "wide",
  },
];

export default function Home() {
  return (
    <div className="relative w-full bg-[#0B1D32]">
      {/* ═══════════════════════════════════════════════
          SECTION 1 — City skyline (Main Background)
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
          ═══════════════════════════════════════════════ */}
      <div className="relative w-full -mt-[45vw] md:-mt-[40vw] lg:-mt-[35vw] z-10 overflow-hidden">
        {/* Upper cloud layer */}
        <img
          src="/images/cloud_up.png"
          alt=""
          className="relative w-full h-auto block z-10"
        />

        {/* Lower cloud layer */}
        <img
          src="/images/cloud_down.png"
          alt=""
          className="relative w-full h-auto block z-10 -mt-[12vw]"
        />

        {/* Character + Vectors overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none pt-[10vw]">
          <img
            src="/vectors/mainpagebackgroundcirclescopy.png"
            alt=""
            className="absolute w-[140%] min-w-[1500px] h-auto opacity-90"
          />
          <img
            src="/images/nayaherself.png"
            alt="Naya"
            className="relative w-[60%] max-w-[850px] h-auto z-10"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 3 & 4 — Content Area
          ═══════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════
          CONTENT WRAPPER (Sections 3, 4, & 5)
          ═══════════════════════════════════════════════ */}
      <div className="relative w-full z-20">
        {/* --- Shared Background Decorative Elements (Strips) --- */}
        {/* Original main page strips that stretch all the way down */}
        <div className="absolute inset-0 pointer-events-none select-none z-20">
          <img
            src="/vectors/main_left_circles.png"
            alt=""
            className="absolute left-0 -top-[100px] w-[200px] md:w-[250px] lg:w-[300px] h-auto opacity-90"
          />
          <img
            src="/vectors/main_right_circles.png"
            alt=""
            className="absolute right-0 -top-[100px] w-[200px] md:w-[250px] lg:w-[300px] h-auto opacity-90"
          />
        </div>

        {/* ── Section 3 & 4: Intro & Grid ── */}
        <div className="relative z-10">
          {/* Intro Text */}
          <div className="relative z-40 text-center px-6 -mt-[12vw] pb-32">
            <p className="font-sans text-white text-base md:text-lg lg:text-xl font-normal leading-relaxed tracking-wide max-w-[850px] mx-auto">
              Hi, I&apos;m{" "}
              <span className="font-accent text-[2.6em] md:text-[3em] text-[#3FE2FF] align-middle px-1 leading-none">
                Naya
              </span>
              ! I&apos;m a digital &amp; traditional artist,
              <br />
              illustrator, graphic designer and animator.
            </p>
          </div>

          {/* The Grid */}
          <div className="relative z-30 max-w-[1650px] mx-auto px-4 md:px-10 lg:px-20 pb-40 flex flex-col gap-y-32">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-[1100fr_506fr] gap-x-16 items-start">
              {[portfolioItems[0], portfolioItems[1]].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col no-underline"
                >
                  <div className={`relative overflow-hidden rounded-[8px] shadow-2xl transition-all duration-500 group-hover:scale-[1.015] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${item.type === 'wide' ? 'aspect-[1100/768]' : 'aspect-[506/768]'}`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-8 text-center">
                    <h3 className="font-sans font-bold text-white text-[18px] md:text-[20px] tracking-tight">{item.title}</h3>
                    <p className="font-sans text-white/50 text-[14px] md:text-[15px] mt-2 whitespace-pre-line font-medium leading-relaxed italic">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-[506fr_1100fr] gap-x-16 items-start">
              {[portfolioItems[2], portfolioItems[3]].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col no-underline"
                >
                  <div className={`relative overflow-hidden rounded-[8px] shadow-2xl transition-all duration-500 group-hover:scale-[1.015] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${item.type === 'wide' ? 'aspect-[1100/768]' : 'aspect-[506/768]'}`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-8 text-center">
                    <h3 className="font-sans font-bold text-white text-[18px] md:text-[20px] tracking-tight">{item.title}</h3>
                    <p className="font-sans text-white/50 text-[14px] md:text-[15px] mt-2 whitespace-pre-line font-medium leading-relaxed italic">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 5: About & Contact ── */}
        <Footer hideStrips />
      </div>
    </div>
  );
}
