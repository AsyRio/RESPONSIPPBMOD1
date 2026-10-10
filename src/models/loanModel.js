import { supabase } from "../config/supabaseClient.js";

const SELECT = `
  id, member_id, book_id, loan_date, due_date, return_date, status,
  members ( id, name ),
  books ( id, title )
`;

export const LoanModel = {
  // filters: { status, member_id, book_id }
  async getAll(filters = {}) {
    let query = supabase
      .from("loans")
      .select(SELECT)
      .order("loan_date", { ascending: false });
    for (const key of ["status", "member_id", "book_id"]) {
      if (filters[key]) query = query.eq(key, filters[key]);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("loans")
      .select(SELECT)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("loans")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("loans")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("loans").delete().eq("id", id);
    if (error) throw error;
    return { message: "Loan deleted successfully" };
  },
};
