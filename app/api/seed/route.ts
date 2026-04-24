import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { loadUsers, saveUsers, HubUser } from '@/lib/userData';
import { loadModules, saveModules, DEFAULT_MODULES } from '@/lib/moduleData';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { secret } = await req.json();
  if (secret !== process.env.SEED_SECRET && secret !== 'hub-seed-2026') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
  }

  // --- Seed modules ---
  let modulesSeeded = 0;
  const existingModules = await loadModules();
  if (existingModules.length === 0) {
    await saveModules(DEFAULT_MODULES);
    modulesSeeded = DEFAULT_MODULES.length;
  }

  // --- Seed users ---
  const now = new Date().toISOString();
  const modules = existingModules.length > 0 ? existingModules : DEFAULT_MODULES;
  const allModuleSlugs = modules.map(m => m.slug);

  const users = await loadUsers();

  const seedUsers = [
    { name: 'Carl', surname: 'Dos Santos', email: 'carl@outerjoin.co.za', password: 'hub2026' },
    { name: 'Johann', surname: '', email: 'johann@iram.co.za', password: 'hub2026' },
  ];

  let usersAdded = 0;
  for (const su of seedUsers) {
    if (users.find(u => u.email.toLowerCase() === su.email.toLowerCase())) continue;
    const user: HubUser = {
      id: randomUUID(),
      name: su.name,
      surname: su.surname,
      email: su.email,
      passwordHash: await bcrypt.hash(su.password, 10),
      role: 'super-admin',
      modules: allModuleSlugs,
      createdAt: now,
      updatedAt: now,
      forcePasswordChange: true,
    };
    users.push(user);
    usersAdded++;
  }

  if (usersAdded > 0) await saveUsers(users);

  return NextResponse.json({
    ok: true,
    usersAdded,
    totalUsers: users.length,
    modulesSeeded,
    totalModules: modules.length,
  });
}
