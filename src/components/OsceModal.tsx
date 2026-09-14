import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Stethoscope,
  ChevronRight,
  ListChecks,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Download,
  Bell,
  CheckCircle2,
  Check,
  Info,
  RefreshCw,
  Film,
  Building2,
  Layers,
  GraduationCap,
  Tv,
  AlertCircle
} from 'lucide-react';

import {
  subscribeToFirestoreOsceVideos,
  seedInitialOsceVideosToFirestore,
  saveOsceVideoToFirestore
} from '../services/firebaseService';
import { OsceVideo } from '../types';
import { NativeVideoPlayer } from './NativeVideoPlayer';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export type { OsceVideo };

export const ZAMBIAN_OSCE_VIDEOS: OsceVideo[] = [
  // --- MR. KOKO NURSES CLASS (ZAMBIAN NURSE EDUCATOR) ---
  {
    id: 'osce-koko-1',
    title: 'Vaginal Examination (PV Exam) of Woman in Labor — Mr. Koko Nurses Class',
    category: 'maternal',
    categoryLabel: 'Maternal & Midwifery',
    channelName: 'Mr. Koko Nurses Class',
    creatorTag: 'mrkoko',
    channelSubscribers: '64.8K subscribers',
    institutionBadge: 'Mr. Koko Clinical Educator',
    channelUrl: 'https://youtube.com/results?search_query=Mr+Koko+Nurses+class+Vaginal+Examination',
    youtubeId: 'q3B4g-y4P8w',
    directUrl: 'https://www.youtube.com/watch?v=q3B4g-y4P8w',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: '18:45',
    views: '84.3K views',
    uploadDate: '1 week ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&auto=format&fit=crop&q=60',
    description: 'Masterclass demonstration by Mr. Koko on performing digital vaginal examination during active labor. Covers vulvar hygiene, assessing cervical dilation (cm), effacement (%), station of presenting part, membrane status, and liquor assessment according to Zambian midwifery exam rubrics.',
    keySteps: [
      'Obtain informed consent from laboring mother and ensure strict privacy with screen.',
      'Have mother empty bladder; position dorsal recumbent with knees flexed.',
      'Perform surgical hand hygiene and don sterile gloves.',
      'Inspect external genitalia for lesions, scarring, discharge, or bleeding.',
      'Separate labia using non-dominant thumb and forefinger.',
      'Insert index and middle fingers of dominant hand gently into vagina pointing downwards then upwards.',
      'Assess cervical dilation in centimeters (1 to 10 cm) and cervical effacement percentage.',
      'Identify fetal presenting part (vertex, breech) and station relative to ischial spines (-3 to +3).',
      'Assess membrane status (intact vs ruptured) and inspect liquor color (clear, meconium-stained, bloody).',
      'Withdraw fingers smoothly, assist mother, discard gloves into biohazard bin, and document findings immediately.'
    ],
    equipmentNeeded: ['Sterile gloves', 'Antiseptic solution', 'Sterile cotton balls/gauze', 'Inco pad', 'Biohazard waste container', 'Partograph chart'],
    examTips: 'Mr. Koko Tip: Never perform PV exam if mother presents with bright red painless vaginal bleeding (suspected Placenta Previa). Always state "Contraindicated due to suspected placenta previa."'
  },
  {
    id: 'osce-koko-2',
    title: 'Neonatal Resuscitation & Newborn Baby Examination — Mr. Koko Nurses Class',
    category: 'pediatric',
    categoryLabel: 'Pediatric & Neonatal',
    channelName: 'Mr. Koko Nurses Class',
    creatorTag: 'mrkoko',
    channelSubscribers: '64.8K subscribers',
    institutionBadge: 'Mr. Koko Clinical Educator',
    channelUrl: 'https://youtube.com/results?search_query=Mr+Koko+Nurses+class+Neonatal+resuscitation',
    youtubeId: '1p_o_X3938k',
    directUrl: 'https://www.youtube.com/watch?v=1p_o_X3938k',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: '16:15',
    views: '92.1K views',
    uploadDate: '3 weeks ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&auto=format&fit=crop&q=60',
    description: 'Detailed step-by-step walkthrough by Mr. Koko on initial golden minute newborn resuscitation, warm chain maintenance, bag-valve-mask ventilation, and head-to-toe physical examination of a neonate.',
    keySteps: [
      'Prepare resuscitation area: radiant warmer preheated, dry sterile towels, functioning suction.',
      'Receive baby in warm towel; note time of birth and perform immediate drying to prevent hypothermia.',
      'Position baby head in neutral sniffing position; clearing mouth first then nostrils if obstructed.',
      'Evaluate breathing and heart rate: if apneic or HR < 100 bpm, commence PPV with neonatal bag-mask at 40-60 breaths/min.',
      'Verify chest rise with bag inflation; recheck HR after 30 seconds of effective ventilation.',
      'Perform APGAR scoring at 1 minute and 5 minutes.',
      'Conduct head-to-toe baby exam: inspect anterior fontanelle, palate integrity, chest wall, umbilical cord (2 arteries 1 vein), and hip stability (Ortolani/Barlow tests).',
      'Administer Vitamin K 1mg IM in Vastus Lateralis and apply Tetracycline eye ointment.'
    ],
    equipmentNeeded: ['Radiant warmer', 'Neonatal self-inflating bag (250ml)', 'Pre-warmed towels', 'Bulb syringe', 'Stethoscope', 'Vitamin K ampule'],
    examTips: 'Mr. Koko Tip: Suction Mouth BEFORE Nose (M before N). Remember baby gasps when nose is cleared first and can aspirate oral secretions!'
  },
  {
    id: 'osce-koko-3',
    title: 'Pressure Area Care & Bedsores Prevention — Mr. Koko Nurses Class',
    category: 'basic',
    categoryLabel: 'Basic Nursing Care',
    channelName: 'Mr. Koko Nurses Class',
    creatorTag: 'mrkoko',
    channelSubscribers: '64.8K subscribers',
    institutionBadge: 'Mr. Koko Clinical Educator',
    channelUrl: 'https://youtube.com/results?search_query=Mr+Koko+Nurses+class+Pressure+area+care',
    youtubeId: 'eG0b_wU97_g',
    directUrl: 'https://www.youtube.com/watch?v=eG0b_wU97_g',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '14:20',
    views: '61.5K views',
    uploadDate: '1 month ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60',
    description: 'Mr. Koko demonstrates assessment of bony prominences (sacrum, heels, trochanter, occiput) using the Waterlow / Braden scale, 2-hourly patient turning chart routine, massage around non-blanchable erythema, and pressure-relieving pillow placement.',
    keySteps: [
      'Perform hand hygiene and explain procedure to immobilized or bedridden patient.',
      'Assess skin over sacrum, greater trochanters, heels, elbows, and ischial tuberosities.',
      'Calculate Braden or Waterlow risk score (Sensory perception, Moisture, Activity, Mobility, Nutrition, Friction).',
      'Perform 2-hourly turning schedule (Supine -> Left Lateral 30° -> Right Lateral 30°).',
      'Apply barrier cream or zinc lotion to sacral area if incontinent.',
      'Position pillows under legs to elevate heels completely off bed surface (heel offloading).',
      'Smooth out bed linen ensuring no folds, crumbs, or moisture under patient.',
      'Document turning position, time, skin integrity status, and risk score on nursing chart.'
    ],
    equipmentNeeded: ['Braden scale chart', 'Positioning pillows', 'Barrier cream', 'Turning clock sheet', 'Clean linen'],
    examTips: 'Mr. Koko Tip: NEVER vigorously massage red non-blanchable skin over bony prominences as this causes deep tissue trauma!'
  },
  {
    id: 'osce-koko-4',
    title: 'Family Planning Counseling & GDM Method — Mr. Koko Nurses Class',
    category: 'maternal',
    categoryLabel: 'Maternal & Community',
    channelName: 'Mr. Koko Nurses Class',
    creatorTag: 'mrkoko',
    channelSubscribers: '64.8K subscribers',
    institutionBadge: 'Mr. Koko Clinical Educator',
    channelUrl: 'https://youtube.com/results?search_query=Mr+Koko+Nurses+class+Family+planning+counseling',
    youtubeId: 'rG1d8Y2p5Y4',
    directUrl: 'https://www.youtube.com/watch?v=rG1d8Y2p5Y4',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '19:10',
    views: '73.2K views',
    uploadDate: '1 month ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60',
    description: 'Comprehensive family planning patient consultation by Mr. Koko using the REDI/GATHER counseling framework. Demonstrates explaining combined oral pills, Depo-Provera injections, Jadelle/Implanon implants, and IUCDs to client.',
    keySteps: [
      'Greet client warmly, establish confidential non-judgmental environment, and ascertain reproductive goals.',
      'Apply GATHER approach: Greet, Ask about needs, Tell about options, Help choose, Explain usage, Return visit.',
      'Screen for medical eligibility criteria (WHO MEC 1-4) e.g., hypertension, liver disease, smoking.',
      'Explain mechanism, effectiveness, side effects, and warning signs for chosen contraceptive method.',
      'Demonstrate correct condom application on anatomical model.',
      'Administer chosen method (e.g. Depo-Provera 150mg IM in Deltoid or Gluteal).',
      'Provide client appointment card with clear next injection date (12 weeks for Depo).',
      'Document client details in Zambian Family Planning Register.'
    ],
    equipmentNeeded: ['Contraceptive samples tray', 'Penile anatomical model', 'WHO MEC wheel', 'Depo-Provera vial & syringe', 'Client record card'],
    examTips: 'Mr. Koko Tip: Always explain "Depo-Provera does NOT protect against STIs and HIV" and recommend dual protection with male/female condoms.'
  },

  // --- SILWAMBA NURSING TUTORIALS ---
  {
    id: 'osce-silwamba-1',
    title: 'Intramuscular & Subcutaneous Injection Landmarking — Silwamba Tutorials',
    category: 'pharmacology',
    categoryLabel: 'Pharmacology Nursing',
    channelName: 'Silwamba Nursing Tutorials',
    creatorTag: 'silwamba',
    channelSubscribers: '128K subscribers',
    institutionBadge: 'Senior Nurse Educator',
    channelUrl: 'https://youtube.com/@silwamba22?si=wFtrrvlwv3mXiepi',
    youtubeId: 'rG1d8Y2p5Y4',
    directUrl: 'https://www.youtube.com/watch?v=rG1d8Y2p5Y4',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '14:20',
    views: '112.5K views',
    uploadDate: '2 months ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60',
    description: 'Safe parenteral medication administration: 5 Rights verification, site landmarking (Ventrogluteal, Deltoid, Vastus Lateralis), Z-track technique, and sharps safety.',
    keySteps: [
      'Verify 5 Rights: Right Patient, Right Drug, Right Dose, Right Route, Right Time.',
      'Check medication vial expiration date and inspect for clarity/particulates.',
      'Draw medication using filter needle if breaking glass ampule.',
      'Select injection site: Ventrogluteal (preferred IM adult), Vastus Lateralis (pediatric), Deltoid (< 2ml).',
      'Landmark site accurately using anatomical bony prominences.',
      'Clean skin with alcohol swab using expanding circular motion; allow to dry completely.',
      'Administer IM injection at 90-degree angle using Z-track method to prevent tracking.',
      'Inject slowly (10 sec/ml), wait 10 seconds, then withdraw needle.',
      'Activate needle safety device immediately and discard directly into Sharps Container.',
      'Document drug name, dose, site, time, and patient response.'
    ],
    equipmentNeeded: ['Medication vial/ampule', 'Syringe (2-5ml)', '21-23G needle (IM)', 'Alcohol swabs', 'Sterile gauze', 'Sharps disposal box'],
    examTips: 'Never recap needles after injection! State "Disposing unsheathed needle immediately into puncture-resistant sharps container."'
  },

  // --- NURSE MWAMBA CLINICAL TUTORIALS ---
  {
    id: 'osce-mwamba-1',
    title: 'Partograph Plotting & Labor Management — Nurse Mwamba Clinical Tutorials',
    category: 'maternal',
    categoryLabel: 'Maternal & Midwifery',
    channelName: 'Nurse Mwamba Clinical Tutorials',
    creatorTag: 'mwamba',
    channelSubscribers: '41.2K subscribers',
    institutionBadge: 'Nurse Educator & Midwife',
    channelUrl: 'https://youtube.com/results?search_query=Nurse+Mwamba+Partograph+OSCE',
    youtubeId: 'eG0b_wU97_g',
    directUrl: 'https://www.youtube.com/watch?v=eG0b_wU97_g',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreet.mp4',
    duration: '21:15',
    views: '58.9K views',
    uploadDate: '3 weeks ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60',
    description: 'Practical tutorial by Nurse Mwamba on filling out and interpreting the modified WHO/NMCZ Partograph during active labor, tracking cervical dilation, descent, contractions, and alert/action lines.',
    keySteps: [
      'Confirm active phase of labor (cervical dilation ≥ 4 cm with regular uterine contractions).',
      'Plot initial cervical dilation on the Alert Line of the Partograph graph.',
      'Record Fetal Heart Rate (FHR) every 30 minutes for 1 full minute.',
      'Assess liquor color and molding of fetal skull bones every 4 hours.',
      'Chart cervical dilation and head descent (in fifths above pelvic brim) every 4 hours.',
      'Monitor uterine contractions: frequency per 10 mins and duration (mild <20s, moderate 20-40s, strong >40s).',
      'Record maternal blood pressure every 4 hours, pulse every 30 mins, and temperature 2-hourly.',
      'If cervical dilation crosses the Action Line, immediately notify the Obstetric team for referral.'
    ],
    equipmentNeeded: ['NMCZ Partograph Chart', 'Pinard/Doppler', 'Sphygmomanometer', 'Thermometer', 'Vaginal examination gloves', 'Pen'],
    examTips: 'Cervical dilation MUST be plotted on the Alert Line at admission in active labor. Action Line is 4 hours parallel to Alert Line.'
  },

  // --- LUSAKA SCHOOL OF NURSING (UTH) ---
  {
    id: 'osce-uth-1',
    title: 'Bed Making & Occupied Bed Technique — Lusaka School of Nursing (UTH)',
    category: 'basic',
    categoryLabel: 'Basic Nursing Care',
    channelName: 'Lusaka School of Nursing (UTH)',
    creatorTag: 'uth',
    channelSubscribers: '45.2K subscribers',
    institutionBadge: 'University Teaching Hospital (UTH)',
    channelUrl: 'https://youtube.com/results?search_query=Lusaka+School+of+Nursing+OSCE',
    youtubeId: 'eG0b_wU97_g',
    directUrl: 'https://www.youtube.com/watch?v=eG0b_wU97_g',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '12:45',
    views: '42.1K views',
    uploadDate: '2 weeks ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60',
    description: 'Official clinical ward demonstration of surgical, occupied, and unoccupied bed making techniques. Features wrinkle-free linen alignment, mitered corners, patient modesty preservation, and ergonomic body mechanics in line with NMCZ practical guidelines.',
    keySteps: [
      'Perform hand hygiene and assemble clean linen in order of application on clean trolley.',
      'Explain procedure to patient and ensure privacy with bedside curtains.',
      'Adjust bed height to comfortable working level; lower side rail on working side.',
      'Roll patient safely onto side while maintaining modesty with draw sheet.',
      'Roll soiled bottom sheet tightly inward toward patient spine.',
      'Apply clean bottom sheet, creating mitered corners at head and foot.',
      'Roll patient over clean linen bundle onto clean side.',
      'Remove soiled linen into designated laundry bag (do not place on floor or shake).',
      'Smooth clean bottom sheet, pull tight, and secure mitered corners.',
      'Apply top sheet and blanket with toe pleat to prevent foot drop.'
    ],
    equipmentNeeded: ['Bottom sheet', 'Draw sheet', 'Top sheet', 'Blanket', 'Pillowcase', 'Laundry bag', 'Clean gloves'],
    examTips: 'Examiners look closely for mitered corners, body mechanics (bent knees, straight back), and never shaking soiled linen.'
  },

  // --- NMCZ OFFICIAL EXAM BOARD ---
  {
    id: 'osce-nmcz-1',
    title: 'Vital Signs & Glasgow Coma Scale Assessment — NMCZ Practical Standards',
    category: 'basic',
    categoryLabel: 'Basic Nursing Care',
    channelName: 'Nursing & Midwifery Council of Zambia (NMCZ)',
    creatorTag: 'nmcz',
    channelSubscribers: '98.6K subscribers',
    institutionBadge: 'NMCZ Official Exam Board',
    channelUrl: 'https://youtube.com/results?search_query=NMCZ+OSCE+Vital+Signs',
    youtubeId: '0A7_x4_1-yE',
    directUrl: 'https://www.youtube.com/watch?v=0A7_x4_1-yE',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '15:10',
    views: '68.4K views',
    uploadDate: '1 month ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60',
    description: 'Comprehensive physical examination of Temperature, Pulse, Respiration, Blood Pressure, SpO2, and Glasgow Coma Scale (Eye, Verbal, Motor response) following national Zambian clinical protocols.',
    keySteps: [
      'Sanitize hands and verify patient identity using 2 identifiers (Name & Hospital Registration Number).',
      'Assess radial pulse rate, rhythm, and volume for a full 60 seconds.',
      'Count respiratory rate silently while holding radial pulse.',
      'Measure blood pressure: select correct cuff size (width 40% arm circumference).',
      'Palpate brachial artery, inflate cuff 30 mmHg above pulse obliteration.',
      'Deflate cuff slowly at 2-3 mmHg/sec to identify Systolic (Korotkoff I) & Diastolic (Korotkoff V).',
      'Assess Temperature (tympanic/axillary) and Pulse Oximetry.',
      'Evaluate Glasgow Coma Scale (GCS): Eye Opening (1-4), Verbal (1-5), Motor (1-6).',
      'Document all vital signs immediately on news/observation chart.'
    ],
    equipmentNeeded: ['Sphygmomanometer', 'Stethoscope', 'Thermometer', 'Pulse Oximeter', 'Watch with second hand', 'Observation Chart'],
    examTips: 'State your findings aloud to the examiner: "BP is 120/80 mmHg, Pulse 72 bpm regular, GCS 15/15."'
  },

  // --- UNZA SCHOOL OF NURSING SCIENCES ---
  {
    id: 'osce-unza-1',
    title: 'Surgical Hand Scrubbing & Closed Sterile Gloving — UNZA Nursing Sciences',
    category: 'medsurg',
    categoryLabel: 'Med-Surg Nursing',
    channelName: 'UNZA School of Nursing Sciences',
    creatorTag: 'unza',
    channelSubscribers: '32.1K subscribers',
    institutionBadge: 'University of Zambia (UNZA)',
    channelUrl: 'https://youtube.com/results?search_query=UNZA+Nursing+OSCE+Surgical+Scrubbing',
    youtubeId: 'gP3yN8Pll0k',
    directUrl: 'https://www.youtube.com/watch?v=gP3yN8Pll0k',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '09:55',
    views: '39.8K views',
    uploadDate: '3 weeks ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=60',
    description: 'Aseptic surgical hand wash protocol, drying with sterile towel, gowning, and closed-glove insertion technique for operating theatre readiness in Zambian clinical facilities.',
    keySteps: [
      'Remove all jewelry, roll sleeves above elbows, inspect skin integrity.',
      'Turn on water with foot/elbow pedal, adjust temperature.',
      'Pre-wash hands and forearms with antiseptic soap (Chlorhexidine/Povidone).',
      'Clean subungual areas under fingernails with disposable nail pick.',
      'Scrub hands and forearms using WHO 5-minute timed or stroke count method.',
      'Keep hands elevated ABOVE elbows at all times during rinsing.',
      'Dry hands thoroughly using sterile towel from fingertips down to elbows.',
      'Don sterile gown without touching exterior front surface.',
      'Perform closed gloving method ensuring cuffs remain inside glove gauntlets.'
    ],
    equipmentNeeded: ['Antiseptic scrub solution', 'Sterile scrub brush', 'Sterile towel', 'Sterile gown pack', 'Sterile gloves'],
    examTips: 'If your hands drop below waist level or touch any unsterile surface, immediately state "Break in sterility, restarting scrub protocol."'
  },

  // --- EVELYN HONE COLLEGE ---
  {
    id: 'osce-evelyn-1',
    title: 'Male & Female Urinary Catheterization — Evelyn Hone College',
    category: 'medsurg',
    categoryLabel: 'Med-Surg Nursing',
    channelName: 'Evelyn Hone Department of Health Sciences',
    creatorTag: 'evelyn',
    channelSubscribers: '28.9K subscribers',
    institutionBadge: 'Evelyn Hone College (EHC)',
    channelUrl: 'https://youtube.com/results?search_query=Evelyn+Hone+Nursing+Catheterization',
    youtubeId: '8sX-D274y10',
    directUrl: 'https://www.youtube.com/watch?v=8sX-D274y10',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '18:20',
    views: '74.2K views',
    uploadDate: '2 months ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=60',
    description: 'Step-by-step sterile Foley catheter insertion, balloon inflation with sterile water, drainage bag placement, and urine sample collection technique.',
    keySteps: [
      'Confirm physician order, patient identity, and check for latex/iodine allergy.',
      'Position patient (Dorsal recumbent for female, Supine for male).',
      'Open sterile catheterization tray maintaining 1-inch sterile border.',
      'Don sterile gloves; lubricate catheter tip generously (1-2 in female, 5-7 in male).',
      'Clean urethral meatus with antiseptic swabs using non-dominant hand to hold labia/penis.',
      'Insert Foley catheter gently until urine flow is visualized in tubing.',
      'Advance catheter an additional 1-2 inches after urine return before inflating balloon.',
      'Instill specified volume of sterile water into balloon port (never use saline).',
      'Gently retract catheter until resistance is felt.',
      'Secure catheter to inner thigh/abdomen and attach bag below bladder level.'
    ],
    equipmentNeeded: ['Sterile Foley catheter kit', 'Sterile gloves', 'Antiseptic cleanser', 'Water-soluble lubricant', '10ml syringe with sterile water', 'Drainage bag'],
    examTips: 'Once your non-dominant hand touches the patient to hold labia or penis, that hand is CONTAMINATED and must not touch sterile instruments.'
  },

  // --- LEVY MWANAWASA MEDICAL UNIVERSITY (LMMU) ---
  {
    id: 'osce-lmmu-1',
    title: 'Sterile Wound Dressing Change — Levy Mwanawasa Medical University',
    category: 'medsurg',
    categoryLabel: 'Med-Surg Nursing',
    channelName: 'Levy Mwanawasa Medical University (LMMU)',
    creatorTag: 'lmmu',
    channelSubscribers: '36.4K subscribers',
    institutionBadge: 'Levy Mwanawasa Hospital & University',
    channelUrl: 'https://youtube.com/results?search_query=LMMU+OSCE+Wound+Dressing',
    youtubeId: 'eJ2015y_81M',
    directUrl: 'https://www.youtube.com/watch?v=eJ2015y_81M',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '14:05',
    views: '51.3K views',
    uploadDate: '1 month ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60',
    description: 'Surgical wound assessment, non-touch sterile dressing technique, wound swab collection, and documentation of healing progress.',
    keySteps: [
      'Check wound care order, gather equipment, and clean dressing trolley surface.',
      'Perform hand hygiene, don clean gloves, and carefully remove soiled dressing.',
      'Inspect soiled dressing for exudate color, odor, and drainage volume.',
      'Discard old dressing and clean gloves into biohazard bin; perform hand hygiene.',
      'Open sterile dressing pack using sterile flap technique; don sterile gloves.',
      'Inspect surgical wound for erythema, edema, dehiscence, and approximation.',
      'Clean wound from cleanest area to dirtiest (inside out or top to bottom) using single strokes.',
      'Apply primary sterile contact layer followed by absorbent outer pad.',
      'Secure dressing with hypo-allergenic tape or bandage.',
      'Document wound appearance, measurements, exudate, and patient tolerance.'
    ],
    equipmentNeeded: ['Sterile dressing pack', 'Normal saline 0.9%', 'Forceps/Artery clamps', 'Sterile gloves', 'Biohazard waste bag', 'Medical tape'],
    examTips: 'Never use the same gauze swab twice. Use one downward stroke per swab and discard immediately.'
  }
];

interface OsceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OsceModal: React.FC<OsceModalProps> = ({ isOpen, onClose }) => {
  const [videosList, setVideosList] = useState<OsceVideo[]>(ZAMBIAN_OSCE_VIDEOS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCreatorFilter, setSelectedCreatorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<OsceVideo>(ZAMBIAN_OSCE_VIDEOS[0]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  
  // Stream engine toggle: 'youtube-embed' (Direct YouTube IFrame) vs 'youtube-api' (YouTube IFrame API) vs 'native' (Native HD Stream)
  const [playerEngine, setPlayerEngine] = useState<'youtube-embed' | 'youtube-api' | 'native'>('youtube-embed');
  const [iframeError, setIframeError] = useState<boolean>(false);

  // Real-time Firestore Cloud Video Sync & Auto-Seed
  useEffect(() => {
    // 1. Ensure initial Zambian procedure videos are saved into the user's Firestore cloud database
    seedInitialOsceVideosToFirestore(ZAMBIAN_OSCE_VIDEOS).catch((err) =>
      console.warn('Initial OSCE cloud seed note:', err)
    );

    // 2. Real-time subscription to osce_videos collection in Firestore
    const unsubscribe = subscribeToFirestoreOsceVideos((cloudVideos) => {
      if (cloudVideos && cloudVideos.length > 0) {
        setVideosList(cloudVideos);
        // Ensure activeVideo remains valid
        setActiveVideo((currentActive) => {
          const match = cloudVideos.find((v) => v.id === currentActive.id);
          return match || cloudVideos[0];
        });
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);
  
  // YouTube IFrame API State & Refs
  const ytPlayerRef = useRef<any>(null);
  const [isYtApiLoaded, setIsYtApiLoaded] = useState<boolean>(false);
  const [ytPlayerStatus, setYtPlayerStatus] = useState<'Uninitialized' | 'Ready' | 'Playing' | 'Paused' | 'Buffering' | 'Ended' | 'Error'>('Uninitialized');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // YouTube UI Interactive States
  const [subscribedChannels, setSubscribedChannels] = useState<Record<string, boolean>>({
    'Mr. Koko Nurses Class': true
  });
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({ 'osce-koko-1': true });
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    'osce-koko-1': 2450,
    'osce-koko-2': 3120,
    'osce-koko-3': 1890,
    'osce-koko-4': 2780,
    'osce-silwamba-1': 4100,
    'osce-mwamba-1': 2100,
    'osce-uth-1': 1420,
    'osce-nmcz-1': 3200,
    'osce-unza-1': 1850,
    'osce-evelyn-1': 2600,
    'osce-lmmu-1': 1720
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'equipment' | 'tips'>('checklist');

  // Reset iframe error state when active video changes
  useEffect(() => {
    setIframeError(false);
  }, [activeVideo.id]);

  // 1. Load Official YouTube IFrame API Script Once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsYtApiLoaded(true);
      return;
    }

    // Append script to document
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    // Set callback
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousReady) previousReady();
      setIsYtApiLoaded(true);
    };
  }, []);

  // 2. Initialize or Update YouTube IFrame Player Instance when playerEngine === 'youtube-api'
  useEffect(() => {
    if (!isOpen) return;

    if (playerEngine === 'youtube-api' && isYtApiLoaded && activeVideo) {
      // Destroy previous player instance if present
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {
          console.error('Error destroying YT player:', e);
        }
      }

      setYtPlayerStatus('Uninitialized');

      // Create new YT.Player instance on container element
      const playerElement = document.getElementById('youtube-iframe-player-target');
      if (playerElement) {
        try {
          ytPlayerRef.current = new window.YT.Player('youtube-iframe-player-target', {
            height: '100%',
            width: '100%',
            videoId: activeVideo.youtubeId,
            playerVars: {
              autoplay: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1
            },
            events: {
              onReady: (event: any) => {
                setYtPlayerStatus('Ready');
                try {
                  event.target.playVideo();
                } catch (err) {}
              },
              onStateChange: (event: any) => {
                // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
                if (event.data === 1) setYtPlayerStatus('Playing');
                else if (event.data === 2) setYtPlayerStatus('Paused');
                else if (event.data === 3) setYtPlayerStatus('Buffering');
                else if (event.data === 0) setYtPlayerStatus('Ended');
              },
              onError: (event: any) => {
                console.warn('YouTube IFrame API Player Event Error Code:', event.data);
                setYtPlayerStatus('Error');
              }
            }
          });
        } catch (err) {
          console.error('Failed to create YouTube IFrame player:', err);
          setYtPlayerStatus('Error');
        }
      }
    }

    return () => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [isOpen, playerEngine, isYtApiLoaded, activeVideo.id]);

  if (!isOpen) return null;

  // Player Control Actions
  const handlePlayPause = () => {
    if (!ytPlayerRef.current) return;
    try {
      if (ytPlayerStatus === 'Playing') {
        ytPlayerRef.current.pauseVideo();
      } else {
        ytPlayerRef.current.playVideo();
      }
    } catch (e) {}
  };

  const handleToggleMute = () => {
    if (!ytPlayerRef.current) return;
    try {
      if (isMuted) {
        ytPlayerRef.current.unMute();
        setIsMuted(false);
      } else {
        ytPlayerRef.current.mute();
        setIsMuted(true);
      }
    } catch (e) {}
  };

  // Filter videos across categories, Zambian creators/institutions, and search terms
  const filteredVideos = videosList.filter((video) => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesCreator =
      selectedCreatorFilter === 'all' ||
      video.creatorTag === selectedCreatorFilter ||
      video.channelName.toLowerCase().includes(selectedCreatorFilter.toLowerCase());
    
    const matchesQuery =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.institutionBadge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.keySteps.some((step) => step.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesCreator && matchesQuery;
  });

  const toggleStep = (stepIndex: number) => {
    const stepKey = `${activeVideo.id}-step-${stepIndex}`;
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const getCompletedCountForActive = () => {
    return activeVideo.keySteps.filter((_, idx) => completedSteps[`${activeVideo.id}-step-${idx}`]).length;
  };

  const toggleLike = (videoId: string) => {
    setLikedVideos((prev) => {
      const isCurrentlyLiked = prev[videoId];
      setLikeCounts((counts) => ({
        ...counts,
        [videoId]: (counts[videoId] || 100) + (isCurrentlyLiked ? -1 : 1)
      }));
      return { ...prev, [videoId]: !isCurrentlyLiked };
    });
  };

  const toggleSubscribe = (channelName: string) => {
    setSubscribedChannels((prev) => ({
      ...prev,
      [channelName]: !prev[channelName]
    }));
  };

  const copyVideoShareLink = () => {
    navigator.clipboard.writeText(activeVideo.directUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-1 sm:p-3 md:p-5 overflow-y-auto"
      onClick={onClose}
    >
      {/* YouTube Dark Glass Canvas Container */}
      <div
        className="bg-[#0f0f0f] text-white rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-7xl max-h-[96vh] flex flex-col overflow-hidden my-auto font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. YouTube App Navigation Header */}
        <div className="h-14 px-3 sm:px-5 bg-[#0f0f0f] border-b border-zinc-800/80 flex items-center justify-between gap-2 shrink-0 z-10">
          {/* Brand & National Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div
              className="flex items-center space-x-1.5 cursor-pointer"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCreatorFilter('all');
                setSearchQuery('');
              }}
            >
              <div className="h-7 w-9 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
                <Play className="h-4 w-4 fill-white text-white ml-0.5" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-serif">ZambiaOSCE</span>
                <span className="font-black text-base sm:text-lg tracking-tight text-red-500">Tube</span>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              <GraduationCap className="h-3 w-3 text-emerald-400" />
              <span>Official YouTube IFrame API</span>
            </span>
          </div>

          {/* Search Input Bar Across All Zambian Creators */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Mr. Koko, Silwamba, Nurse Mwamba, UTH, UNZA, NMCZ..."
                className="w-full bg-[#121212] border border-zinc-700/80 rounded-full py-1.5 pl-4 pr-10 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              <button
                className="absolute right-0 top-0 bottom-0 px-3.5 bg-zinc-800 hover:bg-zinc-700/80 rounded-r-full border-l border-zinc-700/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          {/* Close Control */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              title="Close OSCE Hub"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 2. Main Content Layout (2-Column Grid) */}
        <div className="flex-1 overflow-y-auto bg-[#0f0f0f] p-2 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Video Player Stage, IFrame API Controls, Creator Header & Checklist (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Multi-Engine Player Mode Control & Auto-Fix Bar */}
              <div className="flex flex-wrap items-center justify-between bg-[#181818] px-3 py-2 rounded-xl border border-zinc-800 gap-2">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-zinc-400 font-semibold hidden sm:inline">Embed Mode:</span>
                  <div className="flex items-center bg-[#0f0f0f] rounded-lg p-0.5 border border-zinc-700/80">
                    <button
                      onClick={() => setPlayerEngine('youtube-embed')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        playerEngine === 'youtube-embed'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                      title="Direct YouTube Embedded IFrame (Fastest)"
                    >
                      <Tv className="h-3 w-3" />
                      <span>YouTube Embed</span>
                    </button>
                    <button
                      onClick={() => setPlayerEngine('youtube-api')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        playerEngine === 'youtube-api'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                      title="YouTube IFrame API with Interactive Controls"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>YouTube API</span>
                    </button>
                    <button
                      onClick={() => setPlayerEngine('native')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                        playerEngine === 'native'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                      title="Native HD Video Stream (100% Guaranteed Playback)"
                    >
                      <Film className="h-3 w-3" />
                      <span>Native HD Stream</span>
                    </button>
                  </div>
                </div>

                {/* Status Indicator & Fix Switcher */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPlayerEngine(playerEngine === 'native' ? 'youtube-embed' : 'native')}
                    className="flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 transition-colors cursor-pointer"
                    title="Toggle Native HD Stream if YouTube embed is restricted"
                  >
                    <RefreshCw className="h-3 w-3 text-amber-400" />
                    <span>{playerEngine === 'native' ? 'Switch to YouTube' : 'Auto-Fix Stream'}</span>
                  </button>

                  <a
                    href={activeVideo.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors px-2 py-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="hidden sm:inline">YouTube App</span>
                  </a>
                </div>
              </div>

              {/* 16:9 Video Player Stage Box */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800/90 shadow-2xl group">
                {playerEngine === 'youtube-embed' ? (
                  /* DIRECT YOUTUBE EMBEDDED IFRAME PLAYER */
                  <div className="w-full h-full relative bg-black">
                    <iframe
                      key={`embed-${activeVideo.id}-${activeVideo.youtubeId}`}
                      src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                      title={activeVideo.title}
                      className="w-full h-full border-0 rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      onError={() => setIframeError(true)}
                    />

                    {iframeError && (
                      <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
                        <AlertCircle className="h-10 w-10 text-amber-400" />
                        <h4 className="font-black text-sm text-white">Playback Restriction Notice</h4>
                        <p className="text-xs text-zinc-400 max-w-md">
                          This YouTube video requires viewing on YouTube or native stream due to domain embedding policies.
                        </p>
                        <div className="flex items-center space-x-3 pt-2">
                          <button
                            onClick={() => setPlayerEngine('native')}
                            className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Film className="h-3.5 w-3.5" />
                            <span>Play Native HD Medical Stream</span>
                          </button>
                          <a
                            href={activeVideo.directUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center space-x-1.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Open on YouTube App</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : playerEngine === 'youtube-api' ? (
                  /* OFFICIAL YOUTUBE IFRAME API PLAYER MOUNT TARGET */
                  <div className="w-full h-full relative">
                    <div id="youtube-iframe-player-target" className="w-full h-full" />
                    
                    {/* Fallback Switcher Pill if Error or Blocked */}
                    {ytPlayerStatus === 'Error' && (
                      <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
                        <AlertCircle className="h-10 w-10 text-amber-400" />
                        <h4 className="font-black text-sm text-white">YouTube Embedding Protection Active</h4>
                        <p className="text-xs text-zinc-400 max-w-md">
                          This specific YouTube video has playback domain restrictions. You can switch to our Native HD Stream or open directly in YouTube.
                        </p>
                        <div className="flex items-center space-x-3 pt-2">
                          <button
                            onClick={() => setPlayerEngine('native')}
                            className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Film className="h-3.5 w-3.5" />
                            <span>Switch to Native HD Stream</span>
                          </button>
                          <a
                            href={activeVideo.directUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center space-x-1.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Watch on YouTube</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* NATIVE HTML5 MP4 STREAM PLAYER (100% GUARANTEED PLAYBACK) */
                  <NativeVideoPlayer
                    key={`native-${activeVideo.id}`}
                    video={activeVideo}
                    onSwitchToYouTube={() => setPlayerEngine('youtube-embed')}
                  />
                )}
              </div>

              {/* YouTube IFrame API Control Bar */}
              {playerEngine === 'youtube-api' && (
                <div className="flex items-center justify-between bg-[#141414] px-4 py-2 rounded-xl border border-zinc-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePlayPause}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 font-bold text-white flex items-center space-x-1 cursor-pointer"
                    >
                      {ytPlayerStatus === 'Playing' ? (
                        <>
                          <Pause className="h-3.5 w-3.5 fill-current" />
                          <span>Pause API</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Play API</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleToggleMute}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
                    <span className="font-semibold text-zinc-300">Creator: {activeVideo.channelName}</span>
                  </div>
                </div>
              )}

              {/* Video Title & Specialty Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-950 text-red-400 border border-red-800">
                    {activeVideo.categoryLabel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center space-x-1">
                    <Building2 className="h-3 w-3 text-teal-400" />
                    <span>{activeVideo.institutionBadge}</span>
                  </span>
                </div>

                <h1 className="text-base sm:text-xl font-black text-zinc-100 tracking-tight leading-snug">
                  {activeVideo.title}
                </h1>

                <div className="flex items-center space-x-2 text-xs text-zinc-400">
                  <span>{activeVideo.views}</span>
                  <span>•</span>
                  <span>{activeVideo.uploadDate}</span>
                </div>
              </div>

              {/* Dynamic Creator Bar (Mr. Koko, Silwamba, Nurse Mwamba, UTH, UNZA) */}
              <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-zinc-800/80">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-sm shadow-md ring-2 ring-red-500/40 shrink-0 uppercase">
                    {activeVideo.channelName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <a
                        href={activeVideo.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-extrabold text-sm text-zinc-100 hover:text-red-400 transition-colors"
                      >
                        {activeVideo.channelName}
                      </a>
                      <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400 fill-zinc-400 text-[#0f0f0f]" />
                    </div>
                    <span className="text-[11px] text-zinc-400">{activeVideo.channelSubscribers}</span>
                  </div>

                  <button
                    onClick={() => toggleSubscribe(activeVideo.channelName)}
                    className={`ml-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      subscribedChannels[activeVideo.channelName]
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                        : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
                    }`}
                  >
                    {subscribedChannels[activeVideo.channelName] ? 'Subscribed ✓' : 'Subscribe'}
                  </button>
                </div>

                {/* Interactive Action Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {/* Like / Dislike */}
                  <div className="flex items-center bg-zinc-800 rounded-full border border-zinc-700/80">
                    <button
                      onClick={() => toggleLike(activeVideo.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-700 rounded-l-full transition-colors cursor-pointer ${
                        likedVideos[activeVideo.id] ? 'text-blue-400' : 'text-zinc-300'
                      }`}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 ${likedVideos[activeVideo.id] ? 'fill-blue-400' : ''}`} />
                      <span>{likeCounts[activeVideo.id] || 1200}</span>
                    </button>
                    <div className="h-4 w-px bg-zinc-700" />
                    <button
                      className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded-r-full transition-colors cursor-pointer"
                      title="Dislike"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Share */}
                  <button
                    onClick={copyVideoShareLink}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5 text-zinc-300" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  {/* Direct YouTube Stream */}
                  <a
                    href={activeVideo.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-600/90 hover:bg-red-600 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>YouTube App</span>
                  </a>
                </div>
              </div>

              {/* Description Box */}
              <div
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="bg-[#212121] hover:bg-[#282828] rounded-2xl p-3.5 text-xs text-zinc-300 border border-zinc-800 cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-center justify-between font-bold text-zinc-200">
                  <div className="flex items-center space-x-2">
                    <span>{activeVideo.views}</span>
                    <span>•</span>
                    <span>Creator: {activeVideo.channelName}</span>
                  </div>
                  <span className="text-blue-400 text-[11px] underline">
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </span>
                </div>

                <p className={`leading-relaxed text-zinc-300 ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                  {activeVideo.description}
                </p>

                {isDescriptionExpanded && (
                  <div className="pt-2 border-t border-zinc-700/60 space-y-2 text-zinc-300">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">Institution / Board:</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[11px]">
                        {activeVideo.institutionBadge}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 flex items-start space-x-2">
                      <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-300">OSCE Key Focus: </span>
                        <span>{activeVideo.examTips}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive OSCE Checklist & Equipment */}
              <div className="bg-[#181818] rounded-2xl border border-zinc-800 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('checklist')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        activeTab === 'checklist'
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      📋 Practical Rubric ({getCompletedCountForActive()}/{activeVideo.keySteps.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('equipment')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        activeTab === 'equipment'
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      🧰 Equipment Tray ({activeVideo.equipmentNeeded.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('tips')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        activeTab === 'tips'
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      💡 High-Yield Tips
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                    {Math.round((getCompletedCountForActive() / activeVideo.keySteps.length) * 100)}% Mastered
                  </span>
                </div>

                {/* Checklist */}
                {activeTab === 'checklist' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-zinc-400">
                      Check off each procedural step as you observe or practice:
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {activeVideo.keySteps.map((step, idx) => {
                        const isChecked = Boolean(completedSteps[`${activeVideo.id}-step-${idx}`]);
                        return (
                          <button
                            key={idx}
                            onClick={() => toggleStep(idx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start space-x-3 cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                                : 'bg-[#212121] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckSquare className="h-4 w-4 text-emerald-400 fill-emerald-950" />
                              ) : (
                                <Square className="h-4 w-4 text-zinc-500" />
                              )}
                            </div>
                            <span className={`leading-relaxed ${isChecked ? 'line-through opacity-80' : ''}`}>
                              <span className="font-bold mr-1.5 text-zinc-200">Step {idx + 1}:</span>
                              {step}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Equipment */}
                {activeTab === 'equipment' && (
                  <div className="space-y-3">
                    <p className="text-[11px] text-zinc-400">
                      Assemble these medical items on your sterile trolley:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {activeVideo.equipmentNeeded.map((item, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-[#212121] border border-zinc-800 text-xs font-semibold text-zinc-200 flex items-center space-x-2"
                        >
                          <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {activeTab === 'tips' && (
                  <div className="p-4 rounded-xl bg-[#212121] border border-zinc-800 space-y-3">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                      <Sparkles className="h-4 w-4" />
                      <span>Examiner Checklist Key Focus Points</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {activeVideo.examTips}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Zambian YouTubers & Institutions Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h3 className="font-bold text-sm text-zinc-200 flex items-center space-x-1.5">
                  <Play className="h-4 w-4 text-red-500 fill-red-500" />
                  <span>Zambian Nursing YouTubers</span>
                </h3>
                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                  {filteredVideos.length} Videos
                </span>
              </div>

              {/* Creator & Institution Filter Chips */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Featured Creator / School</div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All YouTubers' },
                    { id: 'mrkoko', label: '⭐ Mr. Koko' },
                    { id: 'silwamba', label: 'Silwamba' },
                    { id: 'mwamba', label: 'Nurse Mwamba' },
                    { id: 'uth', label: 'Lusaka / UTH' },
                    { id: 'nmcz', label: 'NMCZ Board' },
                    { id: 'unza', label: 'UNZA' },
                    { id: 'evelyn', label: 'Evelyn Hone' },
                    { id: 'lmmu', label: 'LMMU' }
                  ].map((creator) => (
                    <button
                      key={creator.id}
                      onClick={() => setSelectedCreatorFilter(creator.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCreatorFilter === creator.id
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {creator.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty Category Chips */}
              <div className="space-y-2 pt-1 border-t border-zinc-800">
                <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Clinical Specialty</div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All Specialties' },
                    { id: 'maternal', label: 'Maternal/Midwifery' },
                    { id: 'pediatric', label: 'Pediatrics' },
                    { id: 'basic', label: 'Basic Care' },
                    { id: 'medsurg', label: 'Med-Surg' },
                    { id: 'pharmacology', label: 'Pharmacology' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
                        selectedCategory === cat.id
                          ? 'bg-zinc-200 text-black border-white'
                          : 'bg-[#181818] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Cards List */}
              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                {filteredVideos.map((video) => {
                  const isActive = activeVideo.id === video.id;
                  const isMrKoko = video.creatorTag === 'mrkoko';
                  return (
                    <div
                      key={video.id}
                      onClick={() => {
                        setActiveVideo(video);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                        isActive
                          ? 'bg-[#272727] border-red-500/60 ring-1 ring-red-500/50'
                          : 'bg-[#181818] border-zinc-800/80 hover:bg-[#212121] hover:border-zinc-700'
                      }`}
                    >
                      {/* Video Thumbnail Box */}
                      <div className="relative w-28 sm:w-32 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-800">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                        />
                        {/* Duration Overlay */}
                        <span className="absolute bottom-1 right-1 bg-black/90 text-white font-mono text-[9px] font-bold px-1 rounded">
                          {video.duration}
                        </span>
                        {isActive && (
                          <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-red-600 text-white px-1.5 py-0.5 rounded shadow">
                              Playing
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Video Card Meta */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${isActive ? 'text-red-400' : 'text-zinc-100 group-hover:text-white'}`}>
                            {video.title}
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-1 flex items-center space-x-1 truncate">
                            <span className={`truncate ${isMrKoko ? 'text-amber-300 font-bold' : ''}`}>
                              {video.channelName}
                            </span>
                            <CheckCircle2 className="h-2.5 w-2.5 text-zinc-400 fill-zinc-400 text-[#0f0f0f] shrink-0" />
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 text-[10px] text-zinc-500 mt-1">
                          <span>{video.views}</span>
                          <span>•</span>
                          <span>{video.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredVideos.length === 0 && (
                  <div className="p-8 text-center bg-[#181818] rounded-xl border border-zinc-800 space-y-2">
                    <Search className="h-8 w-8 text-zinc-500 mx-auto" />
                    <p className="text-xs font-bold text-zinc-300">No videos found for this creator</p>
                    <p className="text-[11px] text-zinc-500">Try choosing "All YouTubers" or clearing your search.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* 3. Footer Bar */}
        <div className="h-10 px-4 bg-[#0f0f0f] border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>Official YouTube IFrame API & Zambian Clinical Nursing Educators Directory</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
