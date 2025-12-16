export const getTierColor = (tier?: string) => {
  switch (tier) {
    case "triple_diamond": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
    case "double_diamond": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "diamond": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
    case "platinum": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "gold": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "silver": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    case "bronze": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "member": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
};
