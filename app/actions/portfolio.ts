'use server'

import { getRequestContext } from '@cloudflare/next-on-pages';
import { revalidatePath } from 'next/cache';

interface PortfolioGroupData {
  id?: number;
  category: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
}

export async function savePortfolioGroup(data: PortfolioGroupData) {
  try {
    const db = getRequestContext().env.DB;
    const imagesJson = JSON.stringify(data.images);

    await db.prepare(
      `INSERT INTO portfolio_groups (category, title, description, cover_image, images) 
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(data.category, data.title, data.description, data.coverImage, imagesJson)
    .run();
    
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error("D1 Save Error:", err);
    return { error: `Database failure: ${err.message}` };
  }
}

export async function updatePortfolioGroup(id: number, data: Partial<PortfolioGroupData>) {
  try {
    const db = getRequestContext().env.DB;
    
    const sets: string[] = [];
    const values: any[] = [];

    if (data.category) { sets.push("category = ?"); values.push(data.category); }
    if (data.title) { sets.push("title = ?"); values.push(data.title); }
    if (data.description !== undefined) { sets.push("description = ?"); values.push(data.description); }
    if (data.coverImage) { sets.push("cover_image = ?"); values.push(data.coverImage); }
    if (data.images) { sets.push("images = ?"); values.push(JSON.stringify(data.images)); }

    if (sets.length === 0) return { success: true };

    values.push(id);
    await db.prepare(
      `UPDATE portfolio_groups SET ${sets.join(", ")} WHERE id = ?`
    )
    .bind(...values)
    .run();

    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error("D1 Update Error:", err);
    return { error: err.message };
  }
}

export async function deletePortfolioGroup(id: number) {
  try {
    const db = getRequestContext().env.DB;
    await db.prepare("DELETE FROM portfolio_groups WHERE id = ?").bind(id).run();
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error("D1 Delete Error:", err);
    return { error: err.message };
  }
}

export async function getPortfolioGroups(category: string) {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare(
      "SELECT * FROM portfolio_groups WHERE category = ? ORDER BY display_order ASC, created_at DESC"
    )
    .bind(category)
    .all();

    return results.map((row: any) => ({
      ...row,
      images: JSON.parse(row.images as string),
      coverImage: row.cover_image,
    }));
  } catch (err) {
    console.error("D1 Fetch Error:", err);
    return [];
  }
}

export async function getAllPortfolioGroups() {
  try {
    const db = getRequestContext().env.DB;
    const { results } = await db.prepare(
      "SELECT * FROM portfolio_groups ORDER BY created_at DESC"
    )
    .all();

    return results.map((row: any) => ({
      ...row,
      images: JSON.parse(row.images as string),
      coverImage: row.cover_image,
    }));
  } catch (err) {
    console.error("D1 Fetch All Error:", err);
    return [];
  }
}
