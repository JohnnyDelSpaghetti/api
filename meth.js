var date = "2016-05-23T00:00:00.000Z"
var idi = 1;
var ids = [];

function getId(){
    idi++;
    return "--cfc-"+idi;
}

var creator = "identity"+getId();

function createIndicator(name, value, hash) {
    var id = "indicator" + getId();
    ids.push(id);
    return {
        "type": "indicator",
        "id": id,
        "created_by_ref": creator,
        "created": date,
        "modified": date,
        "labels": [],
        "name": name,
        "description": "",
        "pattern": (hash) ? "[ file:hashes.MD5 = '" + value + "' ]" : "[ url:value = '" + value + "' ]",
        "valid_from": date
    }
}

function createMalware(name) {
    var id = "malware" + getId();
    ids.push(id);
    return {
        "type": "malware",
        "id": id,
        "created": date,
        "modified": date,
        "created_by_ref": creator,
        "name": name
    }
}

function createRelation(src,dst) {
    var id = "relationship" + getId();
    ids.push(id);
    return {
        "type": "relationship",
        "id": id,
        "created_by_ref": creator,
        "created": date,
        "modified": date,
        "relationship_type": "indicates",
        "source_ref": src,
        "target_ref": dst
    }
}

var o = {
    "type": "bundle",
    "id": "bundle"+getId(),
    "spec_version": "2.0",
    "objects": [
        {
            "modified": date,
            "type": "identity",
            "identity_class": "organization",
            "object_marking_refs": [],
            "name": "GovCERT.ch",
            "id": creator,
            "created": date
        },
        {
            "type": "report",
            "id": "report"+getId(),
            "created_by_ref": creator,
            "created": date,
            "modified": date,
            "name": "RUAG espionage case",
            "description": "Technical Report about the Espionage Case at RUAG.",
            "published": date,
            "labels": [],
            "object_refs": []
        }
    ]
}

var indicators_base = {
    "22481e4055d438176e47f1b1164a6bad": "srsvc.dll",
    "68b2695f59d5fb3a94120e996b8fafea": "srsvc.dll",
    "3881a38adb90821366e3d6480e6bc496": "ximarsh.dll",
    "1d82c90bcb9863949897e3235b20fb8a": "msximl.dll",
    "1a73e08be91bf6bb0edd43008f8338f3": "msximl.dll",
    "2cfcacd99ab2edcfaf8853a11f5e79d5": "ximarsh.dll",
    "6b34bf9100c1264faeeb4cb686f7dd41": "msximl.dll",
    "9f040c8a4db21bfa329b91ec2c5ff299": "msimghlp.dll",
    "a50d8b078869522f68968b61eeb4e61d": "msimghlp.dll",
    "b849c860dff468cc52ed045aea429afb": "msimghlp.dll",
    "ba860e20c766400eb4fab7f16b6099f6": "ximarsh.dll",
    "2372e90fc7b4d1ab57c40a2eed9dd050": "msssetup.exe"
}

for (var k of Object.keys(indicators_base)) {
    o.objects.push(createIndicator(indicators_base[k], k, true))
}

o.objects.push(createMalware("msssetup.exe"));
o.objects.push(createRelation(
    o.objects.filter(obj => obj.type == "indicator" && obj.name == "msssetup.exe")[0].id,
    o.objects.filter(obj => obj.type == "malware" && obj.name == "msssetup.exe")[0].id
))

var urls = [
    "airmax2015.leadingineurope[.]eu/wp-content/gallery/",
    "bestattung-eckl[.]at/typo3temp/wizard.php",
    "buendnis-depression[.]at/typo3temp/ajaxify-rss.php",
    "deutschland-feuerwerk[.]de/fileadmin/dekoservice/rosefeed.php",
    "digitallaut[.]at/typo3temp/viewpage.php",
    "florida4lottery[.]com/wp-content/languages/index.php",
    "porkandmeadmag[.]com/wp-content/gallery/",
    "salenames[.]cn/wp-includes/pomo/js/",
    "shdv[.]de/fileadmin/shdv/Pressemappe/presserss.php",
    "smartrip-israel[.]com/wp-content/gallery/about.php",
    "woo.dev.ideefix[.]net/wp-content/info/",
    "www.asilocavalsassi[.]it/media/index.php",
    "www.ljudochbild[.]se/wp-includes/category/",
    "www.millhavenplace.co[.]uk/wp-content/gallery/index.php",
    "www[.]jagdhornschule[.]ch/typo3temp/rss-feed.php"
]

urls.forEach(url => o.objects.push(createIndicator("RUAG espionage case C&C URL", url, true)))

o.objects.filter(obj => obj.type == "report")[0].object_refs = o.objects.filter(obj => obj.type != "report" && obj.type != "identity").map(obj => obj.id);

console.log(JSON.stringify(o));