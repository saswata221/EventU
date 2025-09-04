// frontend/src/Components/JsCompo/RoleGate.jsx
import { useAuth } from "../../context/AuthContext";

/**
 * Usage:
 * <RoleGate allow={['manager','admin']} fallback={null}>
 *    ...manager/admin UI...
 * </RoleGate>
 */
export default function RoleGate({ allow, fallback = null, children }) {
  const { role } = useAuth();
  const allowed = Array.isArray(allow) ? allow : [allow];
  return allowed.includes(role) ? children : fallback;
}
