import { Check } from "lucide-react";

export default function MemberSelector({
  members,
  selectedMembers,
  setSelectedMembers,
  getMemberKey,
  getMemberMeta,
}) {
  const resolveKey = (member, index) => {
    if (typeof getMemberKey === "function") {
      const key = getMemberKey(member, index);
      if (key != null && String(key).trim() !== "") return String(key);
    }

    const email = String(member?.email || "").trim();
    const name = String(member?.name || "").trim();
    const phone = String(member?.phone || member?.phone_number || "").trim();

    // Many members can share the same email (captain's email), so include index.
    return `${index}::${email}::${name}::${phone}`;
  };

  const toggleMember = (key) => {
    setSelectedMembers((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <div className="space-y-3">
      {members.map((member, index) => {
        const key = resolveKey(member, index);
        const isSelected = selectedMembers.includes(key);
        const meta = typeof getMemberMeta === "function" ? getMemberMeta(member, index) : null;

        return (
          <div
            key={key}
            onClick={() => toggleMember(key)}
            className={`
              flex items-center justify-between p-4
              border cursor-pointer transition
              ${
                isSelected
                  ? "bg-prakida-flame/10 border-prakida-flame"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }
            `}
          >
            {/* LEFT: MEMBER INFO */}
            <div>
              <p className="text-white font-medium">{member.name}</p>
              <p className="text-sm text-gray-400">{member.email}</p>
              {meta ? (
                <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                  {meta}
                </p>
              ) : null}
            </div>

            {/* RIGHT: CHECKBOX */}
            <div
              className={`
                w-6 h-6 flex items-center justify-center
                border transition
                ${
                  isSelected
                    ? "bg-prakida-flame border-prakida-flame"
                    : "border-white/30"
                }
              `}
            >
              {isSelected && <Check size={16} className="text-white" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
