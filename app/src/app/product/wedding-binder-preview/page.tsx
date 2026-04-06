'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

/**
 * Wedding Planner Binder - Luxury Printable Design
 * Aesthetic: Royal Pinterest, Feminine, Soft Neutrals, Gold Accents
 */

export default function WeddingBinderPreview() {
  return (
    <div className="bg-beige-50 min-h-screen py-10 px-4 flex flex-col items-center gap-16 font-sans select-none print:bg-white print:p-0">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Great+Vibes&family=Inter:wght@300;400;500&display=swap');
        
        :root {
          --royal-gold: #D4AF37;
          --soft-blush: #F5E1DA;
          --champagne: #F7E7CE;
          --muted-brown: #8E735B;
          --cream: #FFFDF9;
        }

        .a4-page {
          width: 210mm;
          height: 297mm;
          background: var(--cream);
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          padding: 25mm 20mm;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          border: 1px solid #EEE;
        }

        @media print {
          .a4-page {
            box-shadow: none;
            border: none;
            margin: 0;
            page-break-after: always;
          }
          .no-print { display: none; }
        }

        .font-heading { font-family: 'Playfair Display', serif; }
        .font-script { font-family: 'Great Vibes', cursive; font-size: 1.8rem; }
        .font-body { font-family: 'Inter', sans-serif; }

        .royal-frame {
          border: 1px solid var(--royal-gold);
          padding: 3px;
          position: relative;
        }
        .royal-frame::after {
          content: '';
          position: absolute;
          inset: 5px;
          border: 0.5px solid var(--royal-gold);
          opacity: 0.5;
        }

        .arch-element {
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          border: 1.5px solid var(--royal-gold);
          padding: 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .floral-corner {
          position: absolute;
          width: 150px;
          height: 150px;
          opacity: 0.4;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 0 C 60 20, 80 20, 100 50 C 80 80, 60 80, 50 100 C 40 80, 20 80, 0 50 C 20 20, 40 20, 50 0' fill='%23D4AF37' opacity='0.2'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
        }
        .top-left { top: 0; left: 0; transform: rotate(0deg); }
        .bottom-right { bottom: 0; right: 0; transform: rotate(180deg); }

        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { 
          text-align: left; 
          border-bottom: 2px solid var(--soft-blush); 
          padding: 12px 8px; 
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          color: var(--muted-brown);
        }
        td { 
          border-bottom: 0.5px solid #F0F0F0; 
          padding: 12px 8px; 
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
        }
        
        .checklist-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          font-size: 0.9rem;
          color: #444;
        }
        .checkbox {
          width: 14px;
          height: 14px;
          border: 1px solid var(--muted-brown);
          border-radius: 2px;
          flex-shrink: 0;
        }

        .section-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 2.4rem;
          color: var(--muted-brown);
          letter-spacing: 0.05em;
          margin: 10px 0;
        }
        .divider {
          width: 60px;
          height: 2px;
          background: var(--royal-gold);
          margin-top: 10px;
          opacity: 0.6;
        }
      `}</style>

      <div className="no-print bg-white p-6 rounded-2xl shadow-lg border border-beige-200 mb-10 max-w-2xl text-center">
        <h2 className="text-xl font-heading font-semibold text-muted-brown mb-2 text-2xl">Wedding Planner Digital Preview</h2>
        <p className="text-muted-foreground mb-4">This is your 7-page premium printable binder design. Use Cmd/Ctrl + P to export as a professional PDF. All input fields are intentionally empty for your customers.</p>
        <button onClick={() => window.print()} className="bg-gold-100 hover:bg-gold-200 text-white px-8 py-3 rounded-full font-medium transition-all shadow-md">
          Print or Export to PDF
        </button>
      </div>

      {/* PAGE 1: COVER */}
      <section className="a4-page flex flex-col items-center justify-center">
        <div className="floral-corner top-left" />
        <div className="floral-corner bottom-right" />
        
        <div className="w-[85%] h-[90%] border-[2px] border-champagne p-4 flex flex-col items-center justify-center">
          <div className="arch-element">
            <span className="font-script text-muted-brown opacity-80 mb-2">The Complete</span>
            <h1 className="font-heading text-6xl font-bold text-muted-brown tracking-[0.1em] uppercase text-center mb-6">Wedding<br/>Planner</h1>
            <div className="divider w-24 h-[1.5px] mb-12" />
            
            <div className="space-y-6 text-center mt-20">
              <div className="border-b-[0.5px] border-muted-brown w-64 h-8 flex items-end justify-center text-champagne-800 italic opacity-40">Bride & Groom Names</div>
              <div className="border-b-[0.5px] border-muted-brown w-64 h-8 flex items-end justify-center text-champagne-800 italic opacity-40">Wedding Date</div>
            </div>
            
            <p className="font-body text-xs mt-32 tracking-[0.3em] uppercase opacity-40">Your Personal Planning Companion</p>
          </div>
        </div>
      </section>

      {/* PAGE 2: WEDDING BUDGET PLANNER */}
      <section className="a4-page">
        <div className="section-header">
          <span className="font-script text-gold-200">Financial Organization</span>
          <h2 className="section-title font-heading tracking-widest uppercase">Budget Planner</h2>
          <div className="divider" />
        </div>
        
        <table>
          <thead>
            <tr>
              <th className="w-[35%]">Expense Category</th>
              <th className="w-[15%] text-center">Estimated</th>
              <th className="w-[15%] text-center">Actual</th>
              <th className="w-[15%] text-center">Paid</th>
              <th className="w-[20%]">Notes</th>
            </tr>
          </thead>
          <tbody>
            {['Venue Hire', 'Catering & Service', 'Wedding Attire', 'Photography & Video', 'Floral Design', 'Decoration & Lighting', 'Cake & Dessert', 'Table Stationery', 'Hair & Makeup', 'Bridal Party Gifts', 'Rings & Jewelry', 'Music & Entertainment', 'Transportation', 'Wedding Favors', 'Accommodation', 'Miscellaneous'].map((item, i) => (
              <tr key={i}>
                <td>{item}</td>
                <td className="bg-beige-50/50"></td>
                <td></td>
                <td className="bg-beige-50/20"></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-auto flex justify-between pt-10 border-t border-soft-blush">
          <p className="font-heading text-lg text-muted-brown">Total Allotted Budget</p>
          <div className="w-40 border-b border-muted-brown"></div>
        </div>
      </section>

      {/* PAGE 3: GUEST LIST TRACKER */}
      <section className="a4-page">
        <div className="section-header">
          <span className="font-script text-gold-200">Cherished People</span>
          <h2 className="section-title font-heading tracking-widest uppercase">Guest List Tracker</h2>
          <div className="divider" />
        </div>
        
        <table className="text-[11px]">
          <thead>
            <tr>
              <th className="w-[25%] text-xs">Name</th>
              <th className="w-[15%] text-center text-xs">Phone/Email</th>
              <th className="w-[10%] text-center text-xs">RSVP</th>
              <th className="w-[10%] text-center text-xs">Plus One</th>
              <th className="w-[10%] text-center text-xs">Gift</th>
              <th className="w-[15%] text-center text-xs">Notes</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 22 }).map((_, i) => (
              <tr key={i}>
                <td className="h-4"></td>
                <td></td>
                <td className="bg-soft-blush/10"></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* PAGE 4: SEATING ARRANGEMENT */}
      <section className="a4-page">
        <div className="section-header">
          <span className="font-script text-gold-200">Reception Layout</span>
          <h2 className="section-title font-heading tracking-widest uppercase">Seating Arrangement</h2>
          <div className="divider" />
        </div>
        
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 mt-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full border border-royal-gold flex items-center justify-center font-heading text-sm text-gold-200">{i + 1}</span>
                <div className="flex-1 border-b border-soft-blush pb-1 font-heading text-xs uppercase tracking-widest">Table {i + 1}</div>
              </div>
              <div className="space-y-2 px-2">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="h-6 border-b border-beige-100 flex items-end">
                    <span className="text-[10px] text-muted-foreground mr-2 font-body">{j + 1}.</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAGE 5: VENDOR CONTACT SHEET */}
      <section className="a4-page">
        <div className="section-header">
          <span className="font-script text-gold-200">The Dream Team</span>
          <h2 className="section-title font-heading tracking-widest uppercase">Vendor Directory</h2>
          <div className="divider" />
        </div>
        
        <div className="grid grid-cols-2 gap-x-12 gap-y-12 mt-10">
          {['Venue & Catering', 'Photography', 'Videography', 'Floral Design', 'Event Planner/Coordinator', 'Entertainment/Music', 'Stationery & Invites', 'Hair & Makeup Artist', 'Cake & Desserts', 'Transportation'].map((vendor, i) => (
            <div key={i} className="space-y-4">
              <h3 className="font-heading text-lg text-muted-brown border-b border-champagne pb-1">{vendor}</h3>
              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#999] w-12">Contact:</span>
                  <div className="flex-1 border-b border-beige-200 h-4"></div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#999] w-12">Phone:</span>
                  <div className="flex-1 border-b border-beige-200 h-4"></div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#999] w-12">Email:</span>
                  <div className="flex-1 border-b border-beige-200 h-4"></div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#999] w-12">Notes:</span>
                  <div className="flex-1 border-b border-beige-200 h-10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAGE 6: WEDDING TIMELINE CHECKLIST */}
      <section className="a4-page">
        <div className="section-header">
          <span className="font-script text-gold-200">Organization</span>
          <h2 className="section-title font-heading tracking-widest uppercase">Timeline Checklist</h2>
          <div className="divider" />
        </div>
        
        <div className="grid grid-cols-2 gap-x-12 gap-y-10 mt-10">
          <div className="space-y-6">
            <h3 className="font-heading font-semibold text-muted-brown text-sm uppercase tracking-widest border-b border-champagne pb-1">12 Months Before</h3>
            {[
              'Announce the engagement',
              'Determine the budget',
              'Create a preliminary guest list',
              'Choose a wedding date & venue',
              'Hire a wedding planner (if using)'
            ].map((task, idx) => (
              <div key={idx} className="checklist-item">
                <div className="checkbox"></div>
                <span>{task}</span>
              </div>
            ))}

            <h3 className="font-heading font-semibold text-muted-brown text-sm uppercase tracking-widest border-b border-champagne pb-1 mt-10">9 - 11 Months Before</h3>
            {[
              'Choose the wedding party',
              'Start shopping for wedding attire',
              'Book key vendors (Photo, Flora, Music)',
              'Research ceremony officiants',
              'Create a wedding vision board'
            ].map((task, idx) => (
              <div key={idx} className="checklist-item">
                <div className="checkbox"></div>
                <span>{task}</span>
              </div>
            ))}
            
            <h3 className="font-heading font-semibold text-muted-brown text-sm uppercase tracking-widest border-b border-champagne pb-1 mt-10">6 - 8 Months Before</h3>
            {[
              'Finalize wedding party attire',
              'Book guest accommodations',
              'Order wedding stationery/invites',
              'Book honeymoon details',
              'Launch wedding website'
            ].map((task, idx) => (
              <div key={idx} className="checklist-item">
                <div className="checkbox"></div>
                <span>{task}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="font-heading font-semibold text-muted-brown text-sm uppercase tracking-widest border-b border-champagne pb-1">3 - 5 Months Before</h3>
            {[
              'Finalize the wedding guest list',
              'Send out Save the Date cards',
              'Plan the rehearsal dinner',
              'Purchase wedding bands',
              'Book hairstylist & MUA'
            ].map((task, idx) => (
              <div key={idx} className="checklist-item">
                <div className="checkbox"></div>
                <span>{task}</span>
              </div>
            ))}

            <h3 className="font-heading font-semibold text-muted-brown text-sm uppercase tracking-widest border-b border-champagne pb-1 mt-10">1 - 2 Months Before</h3>
            {[
              'Mail invitations to guests',
              'Apply for a marriage license',
              'Do hair & makeup trials',
              'Finalize the menu & floor plan',
              'Purchase bridal party gifts'
            ].map((task, idx) => (
              <div key={idx} className="checklist-item">
                <div className="checkbox"></div>
                <span>{task}</span>
              </div>
            ))}

            <h3 className="font-heading font-semibold text-muted-brown text-sm uppercase tracking-widest border-b border-champagne pb-1 mt-10">The Wedding Day</h3>
            {[
              'Stay hydrated and eat breakfast',
              'Give wedding party gifts',
              'Exchange love notes/small gifts',
              'Walk down the aisle!',
              'Celebrate with family & friends'
            ].map((task, idx) => (
              <div key={idx} className="checklist-item text-gold-200">
                <div className="checkbox border-gold-100"></div>
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAGE 7: WEDDING DAY SCHEDULE */}
      <section className="a4-page">
        <div className="section-header">
          <span className="font-script text-gold-200">Minute-by-Minute</span>
          <h2 className="section-title font-heading tracking-widest uppercase">Wedding Day Schedule</h2>
          <div className="divider" />
        </div>
        
        <div className="mt-8">
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1 flex flex-col items-center p-3 bg-beige-50/30 border border-champagne rounded">
              <span className="text-[10px] uppercase font-body tracking-wider text-muted-foreground">Sunrise Elevation</span>
              <span className="font-heading text-muted-brown">Morning Preparations</span>
            </div>
            <div className="flex-1 flex flex-col items-center p-3 bg-beige-50/30 border border-champagne rounded">
              <span className="text-[10px] uppercase font-body tracking-wider text-muted-foreground">The Main Event</span>
              <span className="font-heading text-muted-brown">Ceremony Time</span>
            </div>
            <div className="flex-1 flex flex-col items-center p-3 bg-beige-50/30 border border-champagne rounded">
              <span className="text-[10px] uppercase font-body tracking-wider text-muted-foreground">Evening Celebration</span>
              <span className="font-heading text-muted-brown">Reception Dinner</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th className="w-[20%] text-center uppercase tracking-widest text-[10px]">Timeline</th>
                <th className="w-[80%] uppercase tracking-widest text-[10px]">Task & Location</th>
              </tr>
            </thead>
            <tbody>
              {[
                '06:00 AM', '08:00 AM', '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', 
                '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM', '07:30 PM', '08:30 PM', 
                '09:30 PM', '11:00 PM'
              ].map((time, idx) => (
                <tr key={idx}>
                  <td className="text-center font-heading font-semibold text-gold-200 py-4">{time}</td>
                  <td className="border-b border-beige-100"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="mt-auto text-center text-[10px] font-script opacity-40 text-muted-brown">Creating beautiful memories that last a lifetime</p>
      </section>

      <div className="no-print mt-20 mb-10">
         <p className="text-muted-foreground text-sm opacity-60">Design created for NoorMarket Digital Products. All rights reserved.</p>
      </div>
    </div>
  );
}
