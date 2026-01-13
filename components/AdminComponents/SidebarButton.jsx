
import Link from "next/link";

const SidebarButton = ({ href, icon: Icon, label }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 sm:gap-3 font-medium px-3 py-2 bg-zinc-900 rounded-xl   w-full max-w-55 relative overflow-hidden group"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-50 transition-opacity duration-300 group-hover:opacity-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(rgba(52,211,153,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px",
        }}
      />
      <Icon size={24} className="relative z-10" />
      <p className="truncate relative z-10">{label}</p>
    </Link>
  );
};

export default SidebarButton;
