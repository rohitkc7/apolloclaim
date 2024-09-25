export const segmentData = [
  { label: 'TBB', value: 'TBB' },
  { label: 'TBR', value: 'TBR' },
  { label: 'LTB', value: 'LTB' },
  { label: 'LTR', value: 'LTR' },
  { label: 'SCV', value: 'SCV' },
  { label: 'PCR', value: 'PCR' },
  { label: '2W', value: '2W' },
  { label: 'T,rear', value: 'T_REAR' },
  { label: 'T,front', value: 'T_FRONT' },
  { label: 'OTR', value: 'OTR' },
]

export const tyreSizeData = [
  { label: '7.00-15', value: '7.00-15' },
  { label: '7.00-16', value: '7.00-16' },
  { label: '7.50-16', value: '7.50-16' },
  { label: '8.25-16', value: '8.25-16' },
  { label: '10.00-20', value: '10.00-20' },
  { label: '11.00-20', value: '11.00-20' },
  { label: '12.00-20', value: '12.00-20' },
  { label: '14.00-20', value: '14.00-20' },
  { label: '295/95D20', value: '295/95D20' },
  { label: '8.25-20', value: '8.25-20' },
  { label: '9.00-20', value: '9.00-20' },
  { label: '10.00R20', value: '10.00R20' },
  { label: '295/80R22.5', value: '295/80R22.5' },
  { label: '295/90R20', value: '295/90R20' },
  { label: '9.00R20', value: '9.00R20' },
  { label: '8.25R20', value: '8.25R20' },
  { label: '145 R12 LT', value: '145 R12 LT' },
  { label: '165 R14 LT', value: '165 R14 LT' },
  { label: '215/75 R16', value: '215/75 R16' },
  { label: '7.00 R15', value: '7.00 R15' },
  { label: '7.00 R16', value: '7.00 R16' },
  { label: '215/75 R15', value: '215/75 R15' },
  { label: '215/75 R17.5', value: '215/75 R17.5' },
  { label: '225/75 R17.5', value: '225/75 R17.5' },
  { label: '235/75 R17.5', value: '235/75 R17.5' },
  { label: '7.50 R16', value: '7.50 R16' },
  { label: '215/75 R15', value: '215/75 R15' },
]

export const tyreSizeMapping = {
  LTB: ['7.00-15', '7.00-16', '7.50-16', '8.25-16'],
  TBB: [
    '10.00-20',
    '11.00-20',
    '12.00-20',
    '14.00-20',
    '295/95D20',
    '8.25-20',
    '9.00-20',
  ],
  TBR: ['10.00R20', '295/80R22.5', '295/90R20', '9.00R20', '8.25R20'],
  LTR: [
    '145 R12 LT',
    '165 R14 LT',
    '215/75 R16',
    '7.00 R15',
    '7.00 R16',
    '215/75 R15',
  ],
  SCV: ['215/75 R17.5', '225/75 R17.5', '235/75 R17.5', '7.50 R16'],
}

export const plyRating = [
  { label: '8', value: '8' },
  { label: '10', value: '10' },
  { label: '12', value: '12' },
  { label: '14', value: '14' },
  { label: '16', value: '16' },
  { label: '18', value: '18' },
  { label: '20', value: '20' },
]

export const companyName = [
  { label: 'Apollo', value: 'Apollo' },
  { label: 'MRF', value: 'MRF' },
  { label: 'JK', vlaue: 'JK' },
  { label: 'CEAT', value: 'CEAT' },
  { label: 'MAXXIS', value: 'MAXXIS' },
  { label: 'Bridgestone', value: 'Bridgestone' },
  { label: 'Goodyear', value: 'Goodyear' },
  { label: 'Continental', value: 'Continental' },
  { label: 'Others', value: 'Others' },
]

export const patternData = [
  { label: 'RIB', value: 'RIB' },
  { label: 'Steer', value: 'STEER' },
  { label: 'LUG', value: 'LUG' },
  { label: 'Semilug', value: 'Semilug' },
  { label: 'Block', value: 'Block' },
]

export const defectAreaData = [
  { label: 'SIDEWALL', value: 'SIDEWALL' },
  { label: 'BEAD', value: 'BEAD' },
  { label: 'TREAD', value: 'TREAD' },
  { label: 'INTERIOR', value: 'INTERIOR' },
]

export const defectNameData = [
  // BEAD Defects
  {
    label: 'Distorted bead / Deformed bead / Bead hang up',
    value: 'Distorted bead / Deformed bead / Bead hang up',
    defectArea: 'BEAD',
  },
  {
    label: 'Lockring damage (Bead Area)',
    value: 'Lockring damage (Bead Area)',
    defectArea: 'BEAD',
  },
  {
    label: 'Mounting/Demounting damage (Bead Area)',
    value: 'Mounting/Demounting damage (Bead Area)',
    defectArea: 'BEAD',
  },
  {
    label: 'Rim damage (Non lock ring side - Bead Area)',
    value: 'Rim damage (Non lock ring side - Bead Area)',
    defectArea: 'BEAD',
  },
  {
    label: 'Poor bead repair / finish',
    value: 'Poor bead repair / finish',
    defectArea: 'BEAD',
  },
  { label: 'Leaking at bead', value: 'Leaking at bead', defectArea: 'BEAD' },
  {
    label: 'Chemical damage on bead',
    value: 'Chemical damage on bead',
    defectArea: 'BEAD',
  },
  {
    label: 'Chunks missing in bead',
    value: 'Chunks missing in bead',
    defectArea: 'BEAD',
  },
  {
    label: 'Bead damaged in transit',
    value: 'Bead damaged in transit',
    defectArea: 'BEAD',
  },
  { label: 'Burnt bead', value: 'Burnt bead', defectArea: 'BEAD' },
  { label: 'Discoloured bead', value: 'Discoloured bead', defectArea: 'BEAD' },
  {
    label: 'Collapsed / Buckled beads',
    value: 'Collapsed / Buckled beads',
    defectArea: 'BEAD',
  },
  { label: 'Kinked bead', value: 'Kinked bead', defectArea: 'BEAD' },
  {
    label: 'Bead Bulge / Burst',
    value: 'Bead Bulge / Burst',
    defectArea: 'BEAD',
  },
  { label: 'Chafer bulge', value: 'Chafer bulge', defectArea: 'BEAD' },
  { label: 'Casing Unwrap', value: 'Casing Unwrap', defectArea: 'BEAD' },
  {
    label: 'Ozone cracks in bead area',
    value: 'Ozone cracks in bead area',
    defectArea: 'BEAD',
  },
  {
    label: 'Cords visible in bead area',
    value: 'Cords visible in bead area',
    defectArea: 'BEAD',
  },
  {
    label: 'Rim digging (Bead Area)',
    value: 'Rim digging (Bead Area)',
    defectArea: 'BEAD',
  },
  {
    label: 'Incorrect bead seating',
    value: 'Incorrect bead seating',
    defectArea: 'BEAD',
  },
  { label: 'Broken bead', value: 'Broken bead', defectArea: 'BEAD' },
  {
    label: 'Poor bead toe trimming',
    value: 'Poor bead toe trimming',
    defectArea: 'BEAD',
  },
  { label: 'Blisters on bead', value: 'Blisters on bead', defectArea: 'BEAD' },
  { label: 'Undercured bead', value: 'Undercured bead', defectArea: 'BEAD' },
  {
    label: 'Foreign material cured in bead',
    value: 'Foreign material cured in bead',
    defectArea: 'BEAD',
  },
  {
    label: 'Flow crack in bead',
    value: 'Flow crack in bead',
    defectArea: 'BEAD',
  },
  { label: 'Open bead splice', value: 'Open bead splice', defectArea: 'BEAD' },
  {
    label: 'Loose / Wild bead wire',
    value: 'Loose / Wild bead wire',
    defectArea: 'BEAD',
  },

  // INTERIOR Defects
  { label: 'Crown buckle', value: 'Crown buckle', defectArea: 'INTERIOR' },
  {
    label: 'Innerliner break',
    value: 'Innerliner break',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Innerliner bulge',
    value: 'Innerliner bulge',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Ply bulge at shoulder (Interior) /Burst',
    value: 'Ply bulge at shoulder (Interior) /Burst',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Carcass / Inner Ply bulge',
    value: 'Carcass / Inner Ply bulge',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Open innerliner splice',
    value: 'Open innerliner splice',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Cracks in innerliner',
    value: 'Cracks in innerliner',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Broken/Pulled cords',
    value: 'Broken/Pulled cords',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Damaged innerliner by gaiter usage',
    value: 'Damaged innerliner by gaiter usage',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Damaged innerliner (fitting failure)',
    value: 'Damaged innerliner (fitting failure)',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Poor Innerliner repair / finish',
    value: 'Poor Innerliner repair / finish',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Innerliner Damaged in transit',
    value: 'Innerliner Damaged in transit',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Casing destroyed / Run Flat',
    value: 'Casing destroyed / Run Flat',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Lumps in innerliner',
    value: 'Lumps in innerliner',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Blisters on innerliner',
    value: 'Blisters on innerliner',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Heavy liner/Cords splice/Thick innerliner splice',
    value: 'Heavy liner/Cords splice/Thick innerliner splice',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Folds in carcass / Wrinkled plies in innerliner',
    value: 'Folds in carcass / Wrinkled plies in innerliner',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Foreign material cured in interior',
    value: 'Foreign material cured in interior',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Flow crack in innerliner',
    value: 'Flow crack in innerliner',
    defectArea: 'INTERIOR',
  },
  {
    label: 'CBU at shoulder area',
    value: 'CBU at shoulder area',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Loose cords in innerliner',
    value: 'Loose cords in innerliner',
    defectArea: 'INTERIOR',
  },
  {
    label: 'Irregular cord spacing/Spread cords in innerliner',
    value: 'Irregular cord spacing/Spread cords in innerliner',
    defectArea: 'INTERIOR',
  },

  // SIDEWALL Defects
  {
    label: 'Sidewall Bulge due to Impact /Injury',
    value: 'Sidewall Bulge due to Impact /Injury',
    defectArea: 'SIDEWALL',
  },
  { label: 'Pencil bulge', value: 'Pencil bulge', defectArea: 'SIDEWALL' },
  {
    label: 'Sidewall bulge due to undulation',
    value: 'Sidewall bulge due to undulation',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Turn-up bulge / Crack',
    value: 'Turn-up bulge / Crack',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Open sidewall splice',
    value: 'Open sidewall splice',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Sidewall Cracks / Radial Cracks',
    value: 'Sidewall Cracks / Radial Cracks',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Ozone cracks in sidewall',
    value: 'Ozone cracks in sidewall',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Crack near rim cushion / Rim Line Crack',
    value: 'Crack near rim cushion / Rim Line Crack',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Cords visible in sidewall',
    value: 'Cords visible in sidewall',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Sidewall Impact',
    value: 'Sidewall Impact',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Circumferential total breakthrough (Zipper)',
    value: 'Circumferential total breakthrough (Zipper)',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Sidewall through cut',
    value: 'Sidewall through cut',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Chain damage / Scuff Marks on Sidewall',
    value: 'Chain damage / Scuff Marks on Sidewall',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Sidewall Scoring / Dual touching',
    value: 'Sidewall Scoring / Dual touching',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Poor repair / finish in sidewall',
    value: 'Poor repair / finish in sidewall',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Sidewall throughvented (Pinhole)',
    value: 'Sidewall throughvented (Pinhole)',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Sidewall  penetration',
    value: 'Sidewall penetration',
    defectArea: 'SIDEWALL',
  },

  {
    label: 'Chemical damage on sidewall',
    value: 'Chemical damage on sidewall',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Cuts and snags in sidewall',
    value: 'Cuts and snags in sidewall',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Sidewall damaged in transit',
    value: 'Sidewall damaged in transit',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Casing destroyed / Run Flat',
    value: 'Casing destroyed / Run Flat',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Deflation damage',
    value: 'Deflation damage',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Blisters in sidewall',
    value: 'Blisters in sidewall',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Sidewall undulation / heavy splice',
    value: 'Sidewall undulation / heavy splice',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Sidewall bulge - PCR (open carcass splice)',
    value: 'Sidewall bulge - PCR (open carcass splice)',
    defectArea: 'SIDEWALL',
  },
  { label: 'Sidewall Bulge', value: 'Sidewall Bulge', defectArea: 'SIDEWALL' },
  {
    label: 'Foreign material cured in sidewall',
    value: 'Foreign material cured in sidewall',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Flow crack in sidewall',
    value: 'Flow crack in sidewall',
    defectArea: 'SIDEWALL',
  },
  {
    label: 'Loose wire in sidewall',
    value: 'Loose wire in sidewall',
    defectArea: 'SIDEWALL',
  },

  {
    label: 'Tread Delamination',
    value: 'Tread Delamination',
    defectArea: 'TREAD',
  },
  {
    label: 'Stone trapping / drilling',
    value: 'Stone trapping / drilling',
    defectArea: 'TREAD',
  },
  {
    label: 'Tread chipping & chunking',
    value: 'Tread chipping & chunking',
    defectArea: 'TREAD',
  },
  {
    label: 'Abrasive flakey wear',
    value: 'Abrasive flakey wear',
    defectArea: 'TREAD',
  },
  { label: 'Stubble damage', value: 'Stubble damage', defectArea: 'TREAD' },
  { label: 'Spinning', value: 'Spinning', defectArea: 'TREAD' },
  {
    label: 'Neglected Tread Cut – Bulge (Non Through)',
    value: 'Neglected Tread Cut – Bulge (Non Through)',
    defectArea: 'TREAD',
  },
  {
    label: 'Tread parts / Lugs torn out / Chunking',
    value: 'Tread parts / Lugs torn out / Chunking',
    defectArea: 'TREAD',
  },
  {
    label: 'Neglected Tread Cut (Non Through)',
    value: 'Neglected Tread Cut (Non Through)',
    defectArea: 'TREAD',
  },
  {
    label: 'Shoulder rib tearing',
    value: 'Shoulder rib tearing',
    defectArea: 'TREAD',
  },
  {
    label: 'Tread Damaged in Transit',
    value: 'Tread Damaged in Transit',
    defectArea: 'TREAD',
  },
  {
    label: 'Heel and toe wear',
    value: 'Heel and toe wear',
    defectArea: 'TREAD',
  },
  {
    label: 'Alternated lug / Block Wear',
    value: 'Alternated lug / Block Wear',
    defectArea: 'TREAD',
  },
  {
    label: 'Cupping / Scalloped Wear',
    value: 'Cupping / Scalloped Wear',
    defectArea: 'TREAD',
  },
  {
    label: 'Irregular Wear - Rib sinking',
    value: 'Irregular Wear - Rib sinking',
    defectArea: 'TREAD',
  },
  {
    label: 'Irregular Wear - River wear',
    value: 'Irregular Wear - River wear',
    defectArea: 'TREAD',
  },
  {
    label: 'Irregular Wear - Feathered wear',
    value: 'Irregular Wear - Feathered wear',
    defectArea: 'TREAD',
  },
  {
    label: 'Irregular Wear - Diagonal Wear',
    value: 'Irregular Wear - Diagonal Wear',
    defectArea: 'TREAD',
  },
  { label: 'Irregular wear', value: 'Irregular wear', defectArea: 'TREAD' },
  { label: 'Flat spotting', value: 'Flat spotting', defectArea: 'TREAD' },
  {
    label: 'Poor repair/ finish on tread',
    value: 'Poor repair/ finish on tread',
    defectArea: 'TREAD',
  },
  {
    label: 'Tread throughvented (Pinhole)',
    value: 'Tread throughvented (Pinhole)',
    defectArea: 'TREAD',
  },
  {
    label: 'Chemical damage on tread',
    value: 'Chemical damage on tread',
    defectArea: 'TREAD',
  },
  {
    label: 'Ozone cracks on tread surface',
    value: 'Ozone cracks on tread surface',
    defectArea: 'TREAD',
  },
  {
    label: 'Circumferential crack at shoulder / SWOT',
    value: 'Circumferential crack at shoulder / SWOT',
    defectArea: 'TREAD',
  },
  {
    label: 'Cords visible in tread',
    value: 'Cords visible in tread',
    defectArea: 'TREAD',
  },
  { label: 'Tread impact', value: 'Tread impact', defectArea: 'TREAD' },
  {
    label: 'Tread through cut / Subsequent burst',
    value: 'Tread through cut / Subsequent burst',
    defectArea: 'TREAD',
  },
  {
    label: 'Scoring on tread area',
    value: 'Scoring on tread area',
    defectArea: 'TREAD',
  },
  { label: 'Centre wear', value: 'Centre wear', defectArea: 'TREAD' },
  {
    label: 'Shoulder Wear – Shoulder Scrubbing / Scuffing',
    value: 'Shoulder Wear – Shoulder Scrubbing / Scuffing',
    defectArea: 'TREAD',
  },
  {
    label: 'Tread / Crown bulge',
    value: 'Tread / Crown bulge',
    defectArea: 'TREAD',
  },
  { label: 'Belt edge bulge', value: 'Belt edge bulge', defectArea: 'TREAD' },
  {
    label: 'Tread Shoulder Bulge / Subsequent Burst',
    value: 'Tread Shoulder Bulge / Subsequent Burst',
    defectArea: 'TREAD',
  },
  {
    label: 'Breaker / Belt Bulge',
    value: 'Breaker / Belt Bulge',
    defectArea: 'TREAD',
  },
  {
    label: 'Open tread splice',
    value: 'Open tread splice',
    defectArea: 'TREAD',
  },
  {
    label: 'Groove / Block / Lug base cracking',
    value: 'Groove / Block / Lug base cracking',
    defectArea: 'TREAD',
  },
  {
    label: 'Blisters on tread',
    value: 'Blisters on tread',
    defectArea: 'TREAD',
  },
  {
    label: 'Heavy/Thick tread splice',
    value: 'Heavy/Thick tread splice',
    defectArea: 'TREAD',
  },
  { label: 'Outer ply bulge', value: 'Outer ply bulge', defectArea: 'TREAD' },
  {
    label: 'Foreign material cured in tread',
    value: 'Foreign material cured in tread',
    defectArea: 'TREAD',
  },
  {
    label: 'Flow crack on tread',
    value: 'Flow crack on tread',
    defectArea: 'TREAD',
  },
  {
    label: 'Loose / Wild wire in tread',
    value: 'Loose / Wild wire in tread',
    defectArea: 'TREAD',
  },
]
