export type UserType = 'admin' | 'coach' | 'official' | 'trainer' | 'medic' | 'guardian' | 'skater';

export const USER_TYPE_ORDER: UserType[] = [
  'admin',
  'coach',
  'official',
  'trainer',
  'medic',
  'guardian',
  'skater',
];

export const USER_TYPE_LABELS: Record<UserType, string> = {
  admin: 'Admin',
  coach: 'Coach',
  official: 'Official',
  trainer: 'Trainer',
  medic: 'Medic',
  guardian: 'Guardian',
  skater: 'Skater',
};

export function primaryUserType(userTypes: UserType[]): UserType | null {
  return USER_TYPE_ORDER.find((t) => userTypes.includes(t)) ?? null;
}

export function formatUserTypes(userTypes: UserType[]): string {
  return USER_TYPE_ORDER.filter((t) => userTypes.includes(t))
    .map((t) => USER_TYPE_LABELS[t])
    .join(', ');
}
