import {
  Sparkles, Wind, Layers, ScanLine, ScanFace, Stethoscope, CalendarCheck,
  Lightbulb, Route, FlaskConical, Syringe, Zap, CircleDot, UserCheck, ClipboardList,
  Target, Droplets, Star, Users, BadgePercent, ShieldCheck, Sun, Activity, Search,
  Clock, HeartPulse,
} from 'lucide-react'

// Perambur clinic details (Google Business listing + adgrohair.com/Contact)
export const PHONE = '+917437856789'
export const PHONE_DISPLAY = '+91 74378 56789'
export const EMAIL = 'perambur@adgrohair.com'
export const ADDRESS =
  'No.244, First Floor, Paper Mills Road, Opp. S2 Cinemas, Sembiyan, Perambur, Chennai'
export const ADDRESS_LINES = [
  'No.244, First Floor,',
  'Paper Mills Road, Opp. S2 Cinemas,',
  'Sembiyan, Perambur, Chennai',
]
export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Advanced+GroHair+%26+GloSkin+Clinic+Perambur+244+Paper+Mills+Road+Chennai'
// TODO: replace with the clinic's Google Business Profile reviews link
export const GOOGLE_REVIEWS_URL = MAPS_URL

export const nav = [
  { href: '#treatments', label: 'Treatments' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#process', label: 'How to Book' },
  { href: '#faq', label: 'FAQ' },
]

export const treatmentOptions = [
  'Laser Hair Removal', 'Acne Scar Treatment', 'Chemical Peel Treatment',
  'HydraFacial', 'Skin Rejuvenation', 'Glutathione IV Treatment',
]

// Hero trust highlights
export const trust = [
  { value: '4.7', label: 'Google Rating | 250+ Reviews', star: true },
  { value: '1,000+', label: 'Happy Clients' },
  { value: '0%', label: 'EMI Available' },
]

// Overview cards + one detail section per treatment (anchor = id)
export const treatments = [
  { id: 'laser-hair-removal', icon: Zap, title: 'Laser Hair Removal', text: 'For individuals looking for long-term hair reduction.' },
  { id: 'acne-scar', icon: ScanFace, title: 'Acne Scar Treatment', text: 'Explore suitable options for different types of acne scars.' },
  { id: 'chemical-peel', icon: FlaskConical, title: 'Chemical Peel Treatment', text: 'Treatment options for selected pigmentation, skin tone and texture concerns.' },
  { id: 'hydrafacial', icon: Droplets, title: 'HydraFacial', text: 'A facial treatment focused on cleansing, exfoliation and hydration.' },
  { id: 'skin-rejuvenation', icon: Sparkles, title: 'Skin Rejuvenation', text: 'Explore aesthetic treatment options based on your skin concerns.' },
  { id: 'glutathione-iv', icon: Syringe, title: 'Glutathione IV Treatment', text: 'Understand the procedure, suitability and medical considerations.' },
]

export const treatmentSections = [
  {
    id: 'laser-hair-removal',
    title: 'Laser Hair Removal in Perambur',
    intro: 'Looking for a solution to reduce unwanted hair? Explore laser hair reduction options for selected body areas.',
    listTitle: 'Treatment Areas',
    list: ['Face', 'Underarms', 'Arms', 'Legs', 'Back', 'Full Body'],
    listIcons: [ScanFace, Wind, Activity, Activity, Layers, UserCheck],
    understand: ['Skin and hair assessment', 'Suitable treatment areas', 'Expected sessions', 'Pre- and post-treatment care'],
    understandIcons: [ScanLine, Target, CalendarCheck, ClipboardList],
    cta: 'Book Laser Hair Removal Consultation',
  },
  {
    id: 'acne-scar',
    title: 'Acne Scar Treatment in Perambur',
    intro: 'Acne scars can vary in type and depth. A consultation helps identify suitable treatment options based on your skin condition.',
    listTitle: 'Common Acne Scar Types',
    list: ['Atrophic acne scars', 'Ice pick scars', 'Boxcar scars', 'Rolling scars', 'Uneven skin texture'],
    listIcons: [CircleDot, CircleDot, CircleDot, Wind, Layers],
    understand: ['Acne scar assessment', 'Suitable treatment options', 'Treatment planning', 'Expected outcomes and limitations'],
    understandIcons: [Search, UserCheck, ClipboardList, Target],
    cta: 'Book Acne Scar Consultation',
  },
  {
    id: 'chemical-peel',
    title: 'Chemical Peel Treatment in Perambur',
    intro: 'Explore chemical peel options based on your skin type and concerns.',
    listTitle: 'May Be Considered For',
    list: ['Uneven skin tone', 'Selected pigmentation concerns', 'Dull-looking skin', 'Uneven skin texture', 'Certain types of acne concerns'],
    listIcons: [Layers, Sun, Sparkles, Wind, CircleDot],
    understand: ['Skin type assessment', 'Suitable peel selection', 'Number of sessions, if required', 'Aftercare guidance'],
    understandIcons: [ScanLine, FlaskConical, CalendarCheck, ClipboardList],
    cta: 'Book Chemical Peel Consultation',
  },
  {
    id: 'hydrafacial',
    title: 'HydraFacial Treatment in Perambur',
    intro: 'Explore a facial treatment designed around cleansing, exfoliation and hydration.',
    listTitle: 'Treatment Focus',
    list: ['Deep cleansing', 'Exfoliation', 'Hydration', 'Skin refreshment'],
    listIcons: [Droplets, Layers, Droplets, Sparkles],
    understand: ['Skin assessment', 'Treatment suitability', 'Procedure details', 'Recommended care'],
    understandIcons: [ScanLine, UserCheck, ClipboardList, HeartPulse],
    cta: 'Book HydraFacial Consultation',
  },
  {
    id: 'skin-rejuvenation',
    title: 'Skin Rejuvenation Treatments in Perambur',
    intro: 'Explore aesthetic treatment options based on your skin concerns and individual requirements.',
    listTitle: 'Common Concerns',
    list: ['Uneven skin texture', 'Dull-looking skin', 'Fine lines', 'Selected pigmentation concerns', 'Visible signs of ageing'],
    listIcons: [Layers, Sparkles, Wind, Sun, Clock],
    understand: ['Skin condition assessment', 'Suitable treatment options', 'Personalised treatment planning', 'Expected outcomes and limitations'],
    understandIcons: [ScanLine, UserCheck, ClipboardList, Target],
    cta: 'Book Skin Rejuvenation Consultation',
  },
  {
    id: 'glutathione-iv',
    title: 'Glutathione IV Treatment in Perambur',
    intro: 'Considering Glutathione IV treatment? Understand the procedure, suitability and important medical considerations before making a decision.',
    understand: [
      'Medical history and suitability assessment',
      'Explanation of the IV procedure',
      'Potential risks and side effects',
      'Treatment considerations and limitations',
      'Guidance from a qualified medical professional',
    ],
    understandIcons: [Stethoscope, Syringe, ShieldCheck, Target, UserCheck],
    note: 'Glutathione IV treatment may not be suitable for everyone. The procedure should only be considered following an appropriate medical assessment. Benefits should not be assumed or guaranteed.',
    cta: 'Book Glutathione IV Consultation',
  },
]

// Local trust
export const stats = [
  { icon: Star, value: '4.7', label: 'Google Rating', text: 'Based on 250+ Google Reviews.' },
  { icon: Users, value: '1,000+', label: 'Happy Clients', text: 'Trusted by clients for their aesthetic treatment needs.' },
  { icon: BadgePercent, value: '0%', label: 'EMI Available', text: 'Flexible payment option for eligible treatments, subject to applicable terms.' },
]

// Genuine Google Business Profile reviews (text as posted; star rating assumed 5, confirm on Google)
export const reviews = [
  { name: 'Geetha Neha', rating: 5, date: 'A month ago', text: 'I had a good experience at Advanced Gro Hair & Glo Skin Clinic. The staff were friendly, and the doctor explained the Gluta IV treatment process clearly. The clinic maintained a clean and comfortable environment. Overall, I was satisfied with the service and the professional approach.' },
  { name: 'veera manikandan', rating: 5, date: '4 months ago', text: "Very good product! I've been using Glow Skin for a few weeks and can see a noticeable difference. My skin feels softer, smoother, and looks more radiant. It is easy to apply and gives a natural glow. Highly recommended" },
  { name: 'Yuva Uva', rating: 5, date: '6 months ago', text: 'I went to Advance Grow Hair Perambur. I had some acne and acne scars on my skin. When I showed the doctor, they suggested a Peel and then Face PRP. So now my acne has reduced and they’ve started PRP. Good for the rest, it’s going well. Relatives are asking about it, saying my face looks good. Thank you Advance Grow Hair Perambur....' },
  { name: 'Nandhakumar S S', rating: 5, date: '11 months ago', text: 'Iam Nandhakumar, taking PRP skin treatment in Grohair & Gloskin. Really Excellent and visible result I have seen in my face. Doctor and staffs are so polite and friendly in attending, caring. They given good offer for my treatment. Continuous followup on fixed date. Specific i have to mention that no need to wait to take treatment. In fixed time they will attend and finish the procedure. Doctors will suggest correct treatment with reasonable cost. Who are all want to groom yourself, I will strongly recommend this clinic. My score is 100 percent.' },
  { name: 'Aysha Aysha', rating: 5, date: 'A year ago', text: "I came for consultation fory skin doctor took skin test and then diagnosed it's pigmentation so doctor suggested me to Q-switch laser 6session. Immediately I have started treatment now I'm completed 4session i can good changes in my face so I recommend Advanced Grohair Gloskin clinic Perambur." },
]

export const whyUs = [
  'Multiple aesthetic treatment options',
  'Individual skin assessment',
  'Treatment planning based on suitability',
  'Guidance on procedures and aftercare',
  'Professional consultation',
]

export const steps = [
  { icon: ClipboardList, title: 'Select Your Treatment', text: 'Choose the treatment you are interested in.' },
  { icon: UserCheck, title: 'Share Your Details', text: 'Submit your name and mobile number.' },
  { icon: Lightbulb, title: 'Get a Call Back', text: 'Our team will contact you to coordinate your appointment.' },
  { icon: Route, title: 'Visit the Clinic', text: 'Discuss suitable options during your consultation.' },
]

export const faqs = [
  ['Which skin treatments are available at Perambur?', 'Laser hair removal, acne scar treatment, chemical peels, HydraFacial, skin rejuvenation and Glutathione IV treatment are among the available options. Confirm current availability with the clinic.'],
  ['Is a consultation required before treatment?', 'Yes. A consultation helps assess suitability and understand the procedure, potential risks and expected outcomes.'],
  ['How many sessions will I need?', 'The number of sessions varies depending on the treatment, skin condition and individual response.'],
  ['Is Glutathione IV treatment suitable for everyone?', 'No. Suitability requires an appropriate medical assessment. Potential risks and limitations should be discussed with a qualified medical professional.'],
  ['Where is Advanced GroHair & GloSkin located?', `Visit our Perambur clinic for a consultation: ${ADDRESS}.`],
]
