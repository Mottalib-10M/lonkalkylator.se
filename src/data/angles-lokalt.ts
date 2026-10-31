/**
 * Innehåll som bara gäller en enda kommun respektive en enda lönenivå
 * (RECETTE §6).
 *
 * De åtta kommunsidorna var till 99,5 procent identiska och de nio lönesidorna
 * till drygt 90: bara siffrorna skilde, och kontrollen neutraliserar siffror
 * innan den jämför. Texterna nedan handlar därför om något som är sant för just
 * den kommunen eller just den lönenivån, och ingenting i dem kan flyttas till en
 * annan sida.
 */
export interface Avsnitt {
  rubrik: string;
  stycken: string[];
}

export const KOMMUN_AVSNITT: Record<string, Avsnitt[]> = {
  stockholm: [
    {
      rubrik: 'Lägst kommunalskatt bland storstaderna, och varför',
      stycken: [
        'Stockholms kommun har landets lägsta kommunala skattesats bland de stora kommunerna, och skillnaden mot Göteborg och Malmö förklaras främst av två saker. Skatteunderlaget per invånare är högre, eftersom lönenivå och sysselsättningsgrad är högre, vilket ger mer skatt per procentenhet. Och kommunen betalar in till det kommunala utjämningssystemet i stället för att ta emot, vilket innebär att en del av skillnaden mot andra kommuner är en omfördelning som redan är gjord innan din lön berörs.',
        'För den som flyttar in från en annan kommun betyder det en omedelbar effekt på nettolönen, men först från januari året efter: det är folkbokföringen den 1 november som avgör. En flytt i december ger alltså ingen effekt förrän fjorton månader senare. Den som däremot flyttar ut behåller Stockholms sats hela det pågående inkomståret, vilket i praktiken gör november till den enda månad i året då adressen har någon skattemässig betydelse.',
      ],
    },
  ],
  goteborg: [
    {
      rubrik: 'Västra Götalandsregionens andel av satsen',
      stycken: [
        'I Göteborg utgörs en betydande del av den totala satsen av Västra Götalandsregionens skatt, som finansierar hälso- och sjukvården i hela regionen och som beslutas av regionfullmäktige, inte av kommunen. Det innebär att en göteborgare som jämför sin skattesats med en stockholmares jämför två summor där båda delarna skiljer sig: både kommunens egen sats och regionens. En höjning av regionskatten slår igenom likadant i Göteborg och i en liten kommun i samma region.',
        'Det gör också att jämförelser inom regionen är mer rättvisande än jämförelser mellan regioner: mellan två kommuner i Västra Götaland är regionens del identisk, och hela skillnaden ligger i kommunens egen sats. Den som överväger att flytta till en kranskommun kan därför räkna med att skillnaden i skatt är mindre än spannet i riket antyder, medan skillnaden i avgifter för barnomsorg och sophämtning kan vara större.',
      ],
    },
  ],
  malmo: [
    {
      rubrik: 'Skåne, Öresund och gränsgångarnas särfall',
      stycken: [
        'Malmö har den högsta totala satsen bland de kommuner som har en egen sida här, och Region Skånes del utgör en dryg tredjedel av den. För Malmö tillkommer dock en fråga som inte finns någon annanstans i landet: arbete på andra sidan Öresund. Den som bor i Malmö och arbetar i Danmark beskattas enligt det nordiska skatteavtalet och Öresundsavtalet, vilket i de flesta fall innebär att lönen beskattas i Danmark medan bostadslandet räknar av den skatten.',
        'Kalkylatorn på den här sidan gäller svensk lön från svensk arbetsgivare och kan alltså inte användas för dansk lön. För den som har båda, till exempel en dansk anställning och ett svenskt sidouppdrag, räknas de separat och summeras först i deklarationen. Det är också där det svenska grundavdraget och jobbskatteavdraget fördelas, vilket gör att en enkel addition av två beräkningar nästan alltid blir fel.',
      ],
    },
  ],
  uppsala: [
    {
      rubrik: 'En studentstad, och vad det betyder för skatten',
      stycken: [
        'Uppsala har en stor andel invånare med låga eller oregelbundna arbetsinkomster, vilket inte påverkar skattesatsen men som gör två regler mer relevanta här än i genomsnittskommunen. Den första är grundavdraget, som är störst vid låga inkomster och i praktiken gör de första tjänade kronorna skattefria upp till en gräns. Den andra är jobbskatteavdraget, som bara gäller arbetsinkomst: studiemedel är inte arbetsinkomst och ger därför inget avdrag.',
        'För den som arbetar delar av året, till exempel under sommaren, betyder det att den preliminära skatten som dras varje månad ofta är högre än årets verkliga skatt, eftersom tabellen utgår från att månadslönen återkommer tolv gånger. Skillnaden betalas tillbaka vid deklarationen. Den som vet att årsinkomsten blir låg kan i stället ansöka om jämkning, vilket ger rätt skatt direkt i stället för en återbetalning ett år senare.',
      ],
    },
  ],
  linkoping: [
    {
      rubrik: 'Östergötland och skatten på en industrilön',
      stycken: [
        'Linköping ligger nära riksgenomsnittet i kommunal skattesats, vilket gör kommunen till en användbar utgångspunkt för jämförelser: en beräkning gjord här ligger nära det en genomsnittlig svensk anställd faktiskt betalar. Region Östergötlands del av satsen finansierar sjukvården och beslutas separat från kommunens.',
        'För en industrilön med skiftarbete tillkommer en sak som kalkylatorn inte ser: skifttillägg och övertid är arbetsinkomst och beskattas som lön, men de betalas ofta ut i efterskott, vilket gör att en enskild månad kan hamna i en högre skattetabell än årsinkomsten motiverar. Det är en preliminär effekt som jämnas ut vid deklarationen, men den förklarar varför nettot varierar mellan månader med samma grundlön. Semesterersättning och retroaktiva avtalspåslag ger samma effekt.',
      ],
    },
  ],
  vasteras: [
    {
      rubrik: 'Västmanland och vad som händer vid en kommungräns',
      stycken: [
        'Västerås är den största kommunen i Västmanland, och pendlingen till Stockholmsområdet är betydande. Det gör en princip särskilt konkret här: skatten följer bostaden, inte arbetsplatsen. Den som bor i Västerås och arbetar i Stockholm betalar Västerås kommunalskatt och Region Västmanlands skatt, oavsett var arbetsgivaren finns och oavsett var arbetet utförs.',
        'Reseavdraget är den post som oftast missas vid lång pendling. Det är ett avdrag i deklarationen, inte något arbetsgivaren hanterar, och det gäller bara den del av kostnaden som överstiger en årlig gräns. Kalkylatorn på den här sidan räknar inte med personliga avdrag, vilket innebär att en pendlare med höga resekostnader får tillbaka pengar vid deklarationen som beräkningen inte visar.',
      ],
    },
  ],
  orebro: [
    {
      rubrik: 'Örebro län och hur en satsändring slår',
      stycken: [
        'Örebro ligger i den högre delen av spannet bland de kommuner som har en egen sida här. Det praktiska att känna till är hur en ändring slår: en höjning av den kommunala satsen med en halv procentenhet kostar på en månadslön om 35 000 kronor ungefär 150 kronor i månaden, alltså omkring 1 800 kronor om året, och den slår lika hårt oavsett om höjningen kommer från kommunen eller från regionen.',
        'Eftersom satsen fastställs i budgetbeslut på hösten för följande år, och eftersom folkbokföringen den 1 november avgör vilken sats som gäller, kan en invånare i praktiken aldrig hinna reagera på en höjning genom att flytta: beslutet och folkbokföringsdagen ligger för nära varandra. Det som däremot går att göra är att kontrollera att arbetsgivaren tillämpar rätt tabell från januari, vilket inte alltid sker automatiskt efter en flytt.',
      ],
    },
  ],
  helsingborg: [
    {
      rubrik: 'Nordvastra Skåne och arbete över sundet',
      stycken: [
        'Helsingborg ligger i Region Skåne, vars del av skattesatsen är densamma som i Malmö, medan kommunens egen sats skiljer sig. Hela skillnaden mellan de två stadernas totala sats ligger alltså i kommunbeslutet, vilket gör jämförelsen mellan dem ovanligt ren: samma region, olika kommun.',
        'Precis som i Malmö är arbete i Danmark en realitet för en del av invånarna, men med en skillnad som spelar roll: från Helsingborg sker pendlingen oftast till Helsingör och inte till Köpenhamn, och avståndet gör kombinationen av svensk och dansk anställning vanligare än ett rent danskt anställningsförhållande. Vid två anställningar i två länder räknas skatten inte på summan av lönerna utan land för land, med avräkning enligt det nordiska skatteavtalet, och en enkel addition av två kalkylatorer blir därför fel.',
      ],
    },
  ],
};

export const LON_AVSNITT: Record<number, Avsnitt[]> = {
  25000: [
    {
      rubrik: 'Vid 25 000 kronor är grundavdraget störst',
      stycken: [
        'På den här nivån är grundavdraget en av de tyngsta posterna i beräkningen. Avdraget är konstruerat så att det är stort vid låga inkomster, når sitt maximum i ett intervall och trappas därefter ned, vilket innebär att den effektiva skattesatsen stiger snabbare mellan 20 000 och 30 000 kronor än mellan 40 000 och 50 000. Jobbskatteavdraget verkar i samma riktning och är på väg upp mot sitt högsta belopp.',
        'Det praktiska följden är att en löneökning på den här nivån ger mindre i handen än procenttalet antyder, eftersom både grundavdraget och jobbskatteavdraget förändras samtidigt. Marginalskatten är dock fortfarande långt under den nivå som gäller över brytpunkten för statlig skatt: ingen del av inkomsten beskattas med de tjugo procentenheterna extra, och avståndet till den gränsen är mer än dubbla lönen.',
      ],
    },
  ],
  30000: [
    {
      rubrik: 'Nära medianlönen, och nära jobbskatteavdragets topp',
      stycken: [
        'En månadslön kring 30 000 kronor ligger nära den svenska medianlönen, vilket gör den till den nivå där skattereglerna är mest representativa: grundavdraget har passerat sitt maximum, jobbskatteavdraget ligger nära sitt högsta belopp, och den statliga skatten är ännu långt borta. Det är också nivån där skillnaden mellan kommuner är lättast att se, eftersom hela inkomsten beskattas kommunalt.',
        'Vid en jämförelse mellan två kommuner med tre procentenheters skillnad handlar det på den här lönen om drygt 700 kronor i månaden, alltså mer än 8 000 kronor om året. Det är mer än vad de flesta årliga löneökningar ger netto, och det är den enda av alla poster i beräkningen som en enskild person kan påverka utan att ändra något i sitt arbete.',
      ],
    },
  ],
  35000: [
    {
      rubrik: 'Referensnivån, och varför den används',
      stycken: [
        'En månadslön om 35 000 kronor används genomgående på den här webbplatsen som referens vid jämförelser mellan kommuner, av två skäl. Lönen ligger tillräckligt högt för att grundavdragets avtrappning är avklarad, så att kommunens sats får full effekt, och tillräckligt lågt för att den statliga skatten inte blandar in en post som är lika i hela landet. Skillnaden mellan två kommuner blir därför ren kommunalskatt.',
        'Det är också på den här nivån som skillnaden mellan preliminär skatt och slutlig skatt oftast uppstår av en annan orsak än kommunen: bonus, retroaktiv lön och semesterersättning betalas i enskilda månader och dras enligt en tabell som antar att beloppet återkommer varje månad. Den som får en bonus utbetald i en månad betalar därför för hög skatt den månaden och får mellanskillnaden tillbaka vid deklarationen.',
      ],
    },
  ],
  40000: [
    {
      rubrik: 'Vid 40 000 kronor börjar jobbskatteavdraget trappas ned',
      stycken: [
        'Någonstans i intervallet mellan 40 000 och 50 000 kronor i månaden börjar jobbskatteavdraget minska med tre procent av inkomsten över en brytpunkt. Effekten är att marginalskatten stiger med tre procentenheter utan att någon skattesats ändras, vilket är svårt att se på en lönespecifikation men tydligt i en beräkning av vad nästa tusenlapp ger.',
        'Det gör den här nivån till den där en löneökning och en ökad tjänstepensionsavsättning skiljer sig mest i värdet. Lön beskattas nu i ett intervall med höjd marginaleffekt, medan avsättning till tjänstepension inte beskattas när den görs utan när den tas ut, oftast till en lägre skattesats. Vid löneförhandlingar på den här nivån är det därför en reell skillnad om ökningen tas som lön eller som pension.',
      ],
    },
  ],
  45000: [
    {
      rubrik: 'Avståndet till brytpunkten, och vad den kostar',
      stycken: [
        'Vid 45 000 kronor i månaden närmar sig årsinkomsten brytpunkten för statlig inkomstskatt, och det är det avståndet som avgör värdet av en löneökning. Under brytpunkten beskattas nästa krona kommunalt plus effekten av jobbskatteavdragets avtrappning. Över brytpunkten tillkommer tjugo procentenheter statlig skatt på den överskjutande delen, och marginalskatten hamnar då nära femtio procent.',
        'Brytpunkten gäller årsinkomst, inte månadslön, vilket har en praktisk följd som ofta förbises: en bonus eller en retroaktiv utbetalning kan lyfta årsinkomsten över gränsen även om månadslönen ligger under. Det är årets summa som räknas, och det är därför vid årsskiftet, inte vid utbetalningen, som det avgörs om den statliga skatten blev aktuell.',
      ],
    },
  ],
  50000: [
    {
      rubrik: 'Över brytpunkten: vad som ändras och vad som inte gör det',
      stycken: [
        'På en månadslön om 50 000 kronor ligger årsinkomsten över brytpunkten för statlig inkomstskatt, vilket innebär att tjugo procent tillkommer på den del som överstiger gränsen. Två missförstånd är vanliga. Det första är att hela inkomsten skulle beskattas högre: den lägre delen beskattas precis som förut. Det andra är att den kommunala satsen skulle spela mindre roll: den gäller fortfarande hela inkomsten och är alltjämt den största posten.',
        'Det som däremot ändras i grunden är värdet av avdrag. Ett avdrag minskar den beskattningsbara inkomsten, och över brytpunkten minskar det därför en inkomst som beskattas med både kommunal och statlig skatt. Samma avdrag är alltså värt betydligt mer här än på en lägre lön, vilket gör att reseavdrag, ränteavdrag och avdrag för tjänsteresor först på den här nivån blir stora nog att märka i deklarationen.',
      ],
    },
  ],
  60000: [
    {
      rubrik: 'Taket för pensionsgrundande inkomst',
      stycken: [
        'Vid 60 000 kronor i månaden närmar sig årsinkomsten taket för pensionsgrundande inkomst, som ligger vid 7,5 inkomstbasbelopp. Över taket ger lönen ingen ytterligare allmän pension, trots att arbetsgivaravgiften fortsätter att betalas på hela lönen. För inkomster över taket är det alltså tjänstepensionen, och inte den allmänna pensionen, som avgör vad som byggs upp.',
        'Det gör två saker viktiga vid en löneförhandling på den här nivån. Den första är vilken tjänstepensionsplan som gäller, eftersom flera avtal har en betydligt högre avsättningsprocent just över taket, ofta tjugo till trettio procent i stället för fyra eller fem. Den andra är om en löneökning över taket alls är det bäst utnyttjade utrymmet, eftersom marginalskatten är hög och pensionseffekten uteblir.',
      ],
    },
  ],
  70000: [
    {
      rubrik: 'Marginalskatt nära femtio procent, och vad som är kvar',
      stycken: [
        'På en månadslön om 70 000 kronor beskattas nästa intjänade krona med kommunalskatt plus tjugo procent statlig skatt, och jobbskatteavdragets avtrappning har i praktiken tagit ut avdraget. Marginalskatten ligger därför kring femtio procent: av en löneökning på 1 000 kronor återstår omkring 500 i handen, vilket är den siffra som behövs när en ökning ställs mot en förmånsbil eller en ökad pensionsavsättning.',
        'Det är också på den här nivån som skillnaden mellan lön och utdelning i ett eget bolag blir en reell fråga, med helt andra regler: utdelning inom gränsbeloppet beskattas med tjugo procent i kapital, medan lön beskattas som ovan men däremot ger pensionsrätt, sjukpenninggrundande inkomst och föräldrapenning. Jämförelsen kan inte göras på skattesatsen alene.',
      ],
    },
  ],
  80000: [
    {
      rubrik: 'Höga inkomster: de poster som kalkylatorn inte ser',
      stycken: [
        'Vid 80 000 kronor i månaden är själva skatteberäkningen enkel, eftersom både grundavdrag och jobbskatteavdrag är utan betydelse på marginalen och hela ökningen beskattas med kommunal plus statlig skatt. Det som avgör nettot är i stället poster utanför lönen: tjänstepensionens utformning över taket, förmåner som bil och bostad, samt personliga avdrag som på den här nivån är värt nära halva sitt belopp i sänkt skatt.',
        'Två saker faller helt utanför kalkylatorn och bör räknas separat. Förmånsbeskattning läggs till den beskattningsbara inkomsten och höjer alltså skatten utan att lönen ökar. Och inkomst av kapital, utdelning, ränta och vinst vid försäljning, beskattas i ett eget inkomstslag med trettio procent och påverkar inte den kommunala eller statliga skatten på lönen. En beräkning som slår samman de två blir fel i båda riktningarna.',
      ],
    },
  ],
};
