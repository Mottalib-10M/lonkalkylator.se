/**
 * Innehall som bara galler en enda kommun respektive en enda loneniva
 * (RECETTE §6).
 *
 * De atta kommunsidorna var till 99,5 procent identiska och de nio lonesidorna
 * till drygt 90: bara siffrorna skilde, och kontrollen neutraliserar siffror
 * innan den jamfor. Texterna nedan handlar darfor om nagot som ar sant for just
 * den kommunen eller just den lonenivan, och ingenting i dem kan flyttas till en
 * annan sida.
 */
export interface Avsnitt {
  rubrik: string;
  stycken: string[];
}

export const KOMMUN_AVSNITT: Record<string, Avsnitt[]> = {
  stockholm: [
    {
      rubrik: 'Lagst kommunalskatt bland storstaderna, och varfor',
      stycken: [
        'Stockholms kommun har landets lagsta kommunala skattesats bland de stora kommunerna, och skillnaden mot Goteborg och Malmo forklaras framst av tva saker. Skatteunderlaget per invanare ar hogre, eftersom loneniva och sysselsattningsgrad ar hogre, vilket ger mer skatt per procentenhet. Och kommunen betalar in till det kommunala utjamningssystemet i stallet for att ta emot, vilket innebar att en del av skillnaden mot andra kommuner ar en omfordelning som redan ar gjord innan din lon berors.',
        'For den som flyttar in fran en annan kommun betyder det en omedelbar effekt pa nettolonen, men forst fran januari aret efter: det ar folkbokforingen den 1 november som avgor. En flytt i december ger alltsa ingen effekt forran fjorton manader senare. Den som daremot flyttar ut behaller Stockholms sats hela det pagaende inkomstaret, vilket i praktiken gor november till den enda manad i aret da adressen har nagon skattemassig betydelse.',
      ],
    },
  ],
  goteborg: [
    {
      rubrik: 'Vastra Gotalandsregionens andel av satsen',
      stycken: [
        'I Goteborg utgors en betydande del av den totala satsen av Vastra Gotalandsregionens skatt, som finansierar halso- och sjukvarden i hela regionen och som beslutas av regionfullmaktige, inte av kommunen. Det innebar att en goteborgare som jamfor sin skattesats med en stockholmares jamfor tva summor dar bada delarna skiljer sig: bade kommunens egen sats och regionens. En hojning av regionskatten slar igenom likadant i Goteborg och i en liten kommun i samma region.',
        'Det gor ocksa att jamforelser inom regionen ar mer rattvisande an jamforelser mellan regioner: mellan tva kommuner i Vastra Gotaland ar regionens del identisk, och hela skillnaden ligger i kommunens egen sats. Den som overvager att flytta till en kranskommun kan darfor rakhna med att skillnaden i skatt ar mindre an spannet i riket antyder, medan skillnaden i avgifter for barnomsorg och sophamtning kan vara storre.',
      ],
    },
  ],
  malmo: [
    {
      rubrik: 'Skane, Oresund och gransgangarnas sarfall',
      stycken: [
        'Malmo har den hogsta totala satsen bland de kommuner som har en egen sida har, och Region Skanes del utgor en dryg tredjedel av den. For Malmo tillkommer dock en fraga som inte finns nagon annanstans i landet: arbete pa andra sidan Oresund. Den som bor i Malmo och arbetar i Danmark beskattas enligt det nordiska skatteavtalet och Oresundsavtalet, vilket i de flesta fall innebar att lonen beskattas i Danmark medan bostadslandet raknar av den skatten.',
        'Kalkylatorn pa den har sidan galler svensk lon fran svensk arbetsgivare och kan alltsa inte anvandas for dansk lon. For den som har bada, till exempel en dansk anstallning och ett svenskt sidouppdrag, rakhas de separat och summeras forst i deklarationen. Det ar ocksa dar det svenska grundavdraget och jobbskatteavdraget fordelas, vilket gor att en enkel addition av tva berakningar nastan alltid blir fel.',
      ],
    },
  ],
  uppsala: [
    {
      rubrik: 'En studentstad, och vad det betyder for skatten',
      stycken: [
        'Uppsala har en stor andel invanare med laga eller oregelbundna arbetsinkomster, vilket inte paverkar skattesatsen men som gor tva regler mer relevanta har an i genomsnittskommunen. Den forsta ar grundavdraget, som ar storst vid laga inkomster och i praktiken gor de forsta tjanade kronorna skattefria upp till en grans. Den andra ar jobbskatteavdraget, som bara galler arbetsinkomst: studiemedel ar inte arbetsinkomst och ger darfor inget avdrag.',
        'For den som arbetar delar av aret, till exempel under sommaren, betyder det att den preliminara skatten som dras varje manad ofta ar hogre an arets verkliga skatt, eftersom tabellen utgar fran att manadslonen aterkommer tolv ganger. Skillnaden betalas tillbaka vid deklarationen. Den som vet att arsinkomsten blir lag kan i stallet ansoka om jamkning, vilket ger ratt skatt direkt i stallet for en aterbetalning ett ar senare.',
      ],
    },
  ],
  linkoping: [
    {
      rubrik: 'Ostergotland och skatten pa en industrilon',
      stycken: [
        'Linkoping ligger nara riksgenomsnittet i kommunal skattesats, vilket gor kommunen till en anvandbar utgangspunkt for jamforelser: en berakning gjord har ligger nara det en genomsnittlig svensk anstalld faktiskt betalar. Region Ostergotlands del av satsen finansierar sjukvarden och beslutas separat fran kommunens.',
        'For en industrilon med skiftarbete tillkommer en sak som kalkylatorn inte ser: skifttillagg och overtid ar arbetsinkomst och beskattas som lon, men de betalas ofta ut i efterskott, vilket gor att en enskild manad kan hamna i en hogre skattetabell an arsinkomsten motiverar. Det ar en preliminar effekt som jamnas ut vid deklarationen, men den forklarar varfor nettot varierar mellan manader med samma grundlon. Semesterersattning och retroaktiva avtalspaslag ger samma effekt.',
      ],
    },
  ],
  vasteras: [
    {
      rubrik: 'Vastmanland och vad som hander vid en kommungrans',
      stycken: [
        'Vasteras ar den storsta kommunen i Vastmanland, och pendlingen till Stockholmsomradet ar betydande. Det gor en princip sarskilt konkret har: skatten foljer bostaden, inte arbetsplatsen. Den som bor i Vasteras och arbetar i Stockholm betalar Vasteras kommunalskatt och Region Vastmanlands skatt, oavsett var arbetsgivaren finns och oavsett var arbetet utfors.',
        'Reseavdraget ar den post som oftast missas vid lang pendling. Det ar ett avdrag i deklarationen, inte nagot arbetsgivaren hanterar, och det galler bara den del av kostnaden som overstiger en arlig grans. Kalkylatorn pa den har sidan rakhar inte med personliga avdrag, vilket innebar att en pendlare med hoga resekostnader far tillbaka pengar vid deklarationen som berakningen inte visar.',
      ],
    },
  ],
  orebro: [
    {
      rubrik: 'Orebro lan och hur en satsandring slar',
      stycken: [
        'Orebro ligger i den hogre delen av spannet bland de kommuner som har en egen sida har. Det praktiska att kanna till ar hur en andring slar: en hojning av den kommunala satsen med en halv procentenhet kostar pa en manadslon om 35 000 kronor ungefar 150 kronor i manaden, alltsa omkring 1 800 kronor om aret, och den slar lika hart oavsett om hojningen kommer fran kommunen eller fran regionen.',
        'Eftersom satsen faststalls i budgetbeslut pa hosten for foljande ar, och eftersom folkbokforingen den 1 november avgor vilken sats som galler, kan en invanare i praktiken aldrig hinna reagera pa en hojning genom att flytta: beslutet och peildatumet ligger for nara varandra. Det som daremot gar att gora ar att kontrollera att arbetsgivaren tillamphar ratt tabell fran januari, vilket inte alltid sker automatiskt efter en flytt.',
      ],
    },
  ],
  helsingborg: [
    {
      rubrik: 'Nordvastra Skane och arbete over sundet',
      stycken: [
        'Helsingborg ligger i Region Skane, vars del av skattesatsen ar densamma som i Malmo, medan kommunens egen sats skiljer sig. Hela skillnaden mellan de tva stadernas totala sats ligger alltsa i kommunbeslutet, vilket gor jamforelsen mellan dem ovanligt ren: samma region, olika kommun.',
        'Precis som i Malmo ar arbete i Danmark en realitet for en del av invanarna, men med en skillnad som spelar roll: fran Helsingborg sker pendlingen oftast till Helsingor och inte till Kobenhamn, och avstandet gor kombinationen av svensk och dansk anstallning vanligare an ett rent danskt anstallningsforhallande. Vid tva anstallningar i tva lander rakhas skatten inte pa summan av lonerna utan land for land, med avrakning enligt det nordiska skatteavtalet, och en enkel addition av tva kalkylatorer blir darfor fel.',
      ],
    },
  ],
};

export const LON_AVSNITT: Record<number, Avsnitt[]> = {
  25000: [
    {
      rubrik: 'Vid 25 000 kronor ar grundavdraget storst',
      stycken: [
        'Pa den har nivan ar grundavdraget en av de tyngsta posterna i berakningen. Avdraget ar konstruerat sa att det ar stort vid laga inkomster, nar sitt maximum i ett intervall och trappas darefter ned, vilket innebar att den effektiva skattesatsen stiger snabbare mellan 20 000 och 30 000 kronor an mellan 40 000 och 50 000. Jobbskatteavdraget verkar i samma riktning och ar pa vag upp mot sitt hogsta belopp.',
        'Det praktiska foljden ar att en loneokning pa den har nivan ger mindre i handen an procenttalet antyder, eftersom bade grundavdraget och jobbskatteavdraget forandras samtidigt. Marginalskatten ar dock fortfarande langt under den niva som gaeller over brytpunkten for statlig skatt: ingen del av inkomsten beskattas med de tjugo procentenheterna extra, och avstandet till den gransen ar mer an dubbla lonen.',
      ],
    },
  ],
  30000: [
    {
      rubrik: 'Nara medianlonen, och nara jobbskatteavdragets topp',
      stycken: [
        'En manadslon kring 30 000 kronor ligger nara den svenska medianlonen, vilket gor den till den niva dar skattereglerna ar mest representativa: grundavdraget har passerat sitt maximum, jobbskatteavdraget ligger nara sitt hogsta belopp, och den statliga skatten ar annu langt borta. Det ar ocksa nivan dar skillnaden mellan kommuner ar lattast att se, eftersom hela inkomsten beskattas kommunalt.',
        'Vid en jamforelse mellan tva kommuner med tre procentenheters skillnad handlar det pa den har lonen om drygt 700 kronor i manaden, alltsa mer an 8 000 kronor om aret. Det ar mer an vad de flesta arliga loneokningar ger netto, och det ar den enda av alla poster i berakningen som en enskild person kan paverka utan att andra nagot i sitt arbete.',
      ],
    },
  ],
  35000: [
    {
      rubrik: 'Referensnivan, och varfor den anvands',
      stycken: [
        'En manadslon om 35 000 kronor anvands genomgaende pa den har webbplatsen som referens vid jamforelser mellan kommuner, av tva skal. Lonen ligger tillrackligt hogt for att grundavdragets avtrappning ar avklarad, sa att kommunens sats far full effekt, och tillrackligt lagt for att den statliga skatten inte blandar in en post som ar lika i hela landet. Skillnaden mellan tva kommuner blir darfor ren kommunalskatt.',
        'Det ar ocksa pa den har nivan som skillnaden mellan preliminar skatt och slutlig skatt oftast uppstar av en annan orsak an kommunen: bonus, retroaktiv lon och semesterersattning betalas i enskilda manader och dras enligt en tabell som antar att beloppet aterkommer varje manad. Den som far en bonus utbetald i en manad betalar darfor for hog skatt den manaden och far mellanskillnaden tillbaka vid deklarationen.',
      ],
    },
  ],
  40000: [
    {
      rubrik: 'Vid 40 000 kronor borjar jobbskatteavdraget trappas ned',
      stycken: [
        'Nagonstans i intervallet mellan 40 000 och 50 000 kronor i manaden borjar jobbskatteavdraget minska med tre procent av inkomsten over en brytpunkt. Effekten ar att marginalskatten stiger med tre procentenheter utan att nagon skattesats andras, vilket ar svart att se pa en lonespecifikation men tydligt i en berakning av vad nasta tusenlapp ger.',
        'Det gor den har nivan till den dar en loneokning och en okad tjanstepensionsavsattning skiljer sig mest i vardet. Lon beskattas nu i ett intervall med hojd marginaleffekt, medan avsattning till tjanstepension inte beskattas nar den gors utan nar den tas ut, oftast till en lagre skattesats. Vid loneforhandlingar pa den har nivan ar det darfor en reell skillnad om okningen tas som lon eller som pension.',
      ],
    },
  ],
  45000: [
    {
      rubrik: 'Avstandet till brytpunkten, och vad den kostar',
      stycken: [
        'Vid 45 000 kronor i manaden narmar sig arsinkomsten brytpunkten for statlig inkomstskatt, och det ar det avstandet som avgor vardet av en loneokning. Under brytpunkten beskattas nasta krona kommunalt plus effekten av jobbskatteavdragets avtrappning. Over brytpunkten tillkommer tjugo procentenheter statlig skatt pa den overskjutande delen, och marginalskatten hamnar da nara femtio procent.',
        'Brytpunkten galler arsinkomst, inte manadslon, vilket har en praktisk foljd som ofta forbises: en bonus eller en retroaktiv utbetalning kan lyfta arsinkomsten over gransen aven om manadslonen ligger under. Det ar arets summa som rakhas, och det ar darfor vid arsskiftet, inte vid utbetalningen, som det avgors om den statliga skatten blev aktuell.',
      ],
    },
  ],
  50000: [
    {
      rubrik: 'Over brytpunkten: vad som andras och vad som inte gor det',
      stycken: [
        'Pa en manadslon om 50 000 kronor ligger arsinkomsten over brytpunkten for statlig inkomstskatt, vilket innebar att tjugo procent tillkommer pa den del som overstiger gransen. Tva missforstand ar vanliga. Det forsta ar att hela inkomsten skulle beskattas hogre: den lagre delen beskattas precis som forut. Det andra ar att den kommunala satsen skulle spela mindre roll: den galler fortfarande hela inkomsten och ar alltjamt den storsta posten.',
        'Det som daremot andras i grunden ar vardet av avdrag. Ett avdrag minskar den beskattningsbara inkomsten, och over brytpunkten minskar det darfor en inkomst som beskattas med bade kommunal och statlig skatt. Samma avdrag ar alltsa vart betydligt mer har an pa en lagre lon, vilket gor att reseavdrag, ranteavdrag och avdrag for tjansteresor forst pa den har nivan blir stora nog att marka i deklarationen.',
      ],
    },
  ],
  60000: [
    {
      rubrik: 'Taket for pensionsgrundande inkomst',
      stycken: [
        'Vid 60 000 kronor i manaden narmar sig arsinkomsten taket for pensionsgrundande inkomst, som ligger vid 7,5 inkomstbasbelopp. Over taket ger lonen ingen ytterligare allman pension, trots att arbetsgivaravgiften fortsatter att betalas pa hela lonen. For inkomster over taket ar det alltsa tjanstepensionen, och inte den allmanna pensionen, som avgor vad som byggs upp.',
        'Det gor tva saker viktiga vid en loneforhandling pa den har nivan. Den forsta ar vilken tjanstepensionsplan som gaeller, eftersom flera avtal har en betydligt hogre avsattningsprocent just over taket, ofta tjugo till trettio procent i stallet for fyra eller fem. Den andra ar om en loneokning over taket alls ar det bast utnyttjade utrymmet, eftersom marginalskatten ar hog och pensionseffekten uteblir.',
      ],
    },
  ],
  70000: [
    {
      rubrik: 'Marginalskatt nara femtio procent, och vad som ar kvar',
      stycken: [
        'Pa en manadslon om 70 000 kronor beskattas nasta intjanade krona med kommunalskatt plus tjugo procent statlig skatt, och jobbskatteavdragets avtrappning har i praktiken tagit ut avdraget. Marginalskatten ligger darfor kring femtio procent: av en loneokning pa 1 000 kronor aterstar omkring 500 i handen, vilket ar den siffra som behovs nar en okning stalls mot en formansbil eller en okad pensionsavsattning.',
        'Det ar ocksa pa den har nivan som skillnaden mellan lon och utdelning i ett eget bolag blir en reell fraga, med helt andra regler: utdelning inom granshbeloppet beskattas med tjugo procent i kapital, medan lon beskattas som ovan men daremot ger pensionsratt, sjukpenninggrundande inkomst och foraldrapenning. Jamforelsen kan inte goras pa skattesatsen alene.',
      ],
    },
  ],
  80000: [
    {
      rubrik: 'Hoga inkomster: de poster som kalkylatorn inte ser',
      stycken: [
        'Vid 80 000 kronor i manaden ar sjalva skatteberakningen enkel, eftersom bade grundavdrag och jobbskatteavdrag ar utan betydelse pa marginalen och hela okningen beskattas med kommunal plus statlig skatt. Det som avgor nettot ar i stallet poster utanfor lonen: tjanstepensionens utformning over taket, formaner som bil och bostad, samt personliga avdrag som pa den har nivan ar vart nara halva sitt belopp i sankt skatt.',
        'Tva saker faller helt utanfor kalkylatorn och bor rakhnas separat. Formansbeskattning laggs till den beskattningsbara inkomsten och hojer alltsa skatten utan att lonen okar. Och inkomst av kapital, utdelning, ranta och vinst vid forsaljning, beskattas i ett eget inkomstslag med trettio procent och paverkar inte den kommunala eller statliga skatten pa lonen. En berakning som slar samman de tva blir fel i bada riktningarna.',
      ],
    },
  ],
};
