import Footer from "../../components/Footer";

export default function AnimationPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#051C30] overflow-hidden">
      {/* Header background */}
      <div className="w-full h-[220px] md:h-[280px] bg-[#0F314D]" />

      {/* Page title */}
      <div className="absolute top-[80px] md:top-[100px] left-0 right-0 flex justify-center px-4">
        <h1
          className="font-grover text-[#48ABBF] text-center text-[32px] sm:text-[40px] md:text-[56px] lg:text-[72px] leading-tight"
        >
          Animations &amp; Motion Graphics
        </h1>
      </div>

      {/* Decorative circles — left side upper */}
      <div className="absolute left-0 top-[480px] md:top-[560px] pointer-events-none select-none">
        <svg width="164" height="164" viewBox="0 0 164 164" fill="none">
          <circle cx="82" cy="82" r="66" fill="#82EF9E" />
          <circle cx="82" cy="82" r="81" stroke="#DBEDF1" strokeWidth="5" />
        </svg>
      </div>

      {/* Decorative circle — right side upper */}
      <div className="absolute right-0 top-[700px] md:top-[900px] pointer-events-none select-none">
        <svg width="328" height="328" viewBox="0 0 328 328" fill="none">
          <circle cx="164" cy="164" r="163.5" fill="#FE898F" fillOpacity="0.5" />
        </svg>
      </div>

      {/* Content placeholder area */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-8 pb-32 flex flex-col gap-10">
        {/* Placeholder slots for future content */}
        <div className="w-full aspect-video rounded-lg bg-[#0F314D]/60 border border-white/5" />
        <div className="w-full aspect-video rounded-lg bg-[#0F314D]/60 border border-white/5" />
      </div>

      {/* Decorative circles — left side lower */}
      <div className="absolute left-0 bottom-[480px] pointer-events-none select-none">
        <svg width="330" height="330" viewBox="0 0 330 330" fill="none">
          <circle cx="165" cy="165" r="163.5" fill="#FE898F" fillOpacity="0.5" />
          <circle cx="39" cy="69" r="38" fill="#F5B87E" />
          <circle cx="75" cy="50" r="64.5" stroke="#DBEDF1" strokeWidth="5" />
        </svg>
      </div>

      {/* Decorative circle outline — right side lower */}
      <div className="absolute right-6 bottom-[340px] pointer-events-none select-none">
        <svg width="162" height="162" viewBox="0 0 162 162" fill="none">
          <circle cx="81" cy="81" r="78.5" stroke="#DBEDF1" strokeOpacity="0.68" strokeWidth="5" />
        </svg>
      </div>

      {/* Decorative circles — bottom left */}
      <div className="absolute left-4 bottom-16 pointer-events-none select-none">
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
          <circle cx="66" cy="66" r="66" fill="#F5CB25" fillOpacity="0.7" />
          <circle cx="96" cy="96" r="48" stroke="#DBEDF1" strokeWidth="5" />
        </svg>
      </div>

      {/* Decorative circles — bottom right */}
      <div className="absolute right-4 bottom-4 pointer-events-none select-none">
        <svg width="94" height="94" viewBox="0 0 94 94" fill="none">
          <circle cx="47" cy="47" r="47" fill="#FB8D6E" fillOpacity="0.74" />
        </svg>
        <svg
          width="70"
          height="70"
          viewBox="0 0 70 70"
          fill="none"
          className="absolute -top-4 -left-4"
        >
          <circle cx="35" cy="35" r="32.5" stroke="#DBEDF1" strokeWidth="5" />
        </svg>
      </div>

      {/* Reusable Footer Component specifically configured for new pages */}
      <Footer />
    </div>
  );
}
