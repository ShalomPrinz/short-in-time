import requests
from bs4 import BeautifulSoup
import json
import time
import os
from urllib.parse import urljoin

# מבנה מלא של כל המסכתות עם תרגומים לאנגלית
MISHNA_STRUCTURE = {
    "זרעים": {
        "ברכות": {"en": "Berakhot", "chapters": 9},
        "פאה": {"en": "Peah", "chapters": 8},
        "דמאי": {"en": "Demai", "chapters": 7},
        "כלאים": {"en": "Kilayim", "chapters": 9},
        "שביעית": {"en": "Sheviit", "chapters": 10},
        "תרומות": {"en": "Terumot", "chapters": 11},
        "מעשרות": {"en": "Maasrot", "chapters": 5},
        "מעשר שני": {"en": "Maaser_Sheni", "chapters": 5},
        "חלה": {"en": "Challah", "chapters": 4},
        "ערלה": {"en": "Orlah", "chapters": 3},
        "בכורים": {"en": "Bikkurim", "chapters": 4}
    },
    "מועד": {
        "שבת": {"en": "Shabbat", "chapters": 24},
        "עירובין": {"en": "Eruvin", "chapters": 10},
        "פסחים": {"en": "Pesachim", "chapters": 10},
        "שקלים": {"en": "Shekalim", "chapters": 8},
        "יומא": {"en": "Yoma", "chapters": 8},
        "סוכה": {"en": "Sukkah", "chapters": 5},
        "ביצה": {"en": "Beitzah", "chapters": 5},
        "ראש השנה": {"en": "Rosh_Hashanah", "chapters": 4},
        "תענית": {"en": "Taanit", "chapters": 4},
        "מגילה": {"en": "Megillah", "chapters": 4},
        "מועד קטן": {"en": "Moed_Katan", "chapters": 3},
        "חגיגה": {"en": "Chagigah", "chapters": 3}
    },
    "נשים": {
        "יבמות": {"en": "Yevamot", "chapters": 16},
        "כתובות": {"en": "Ketubot", "chapters": 13},
        "נדרים": {"en": "Nedarim", "chapters": 11},
        "נזיר": {"en": "Nazir", "chapters": 9},
        "סוטה": {"en": "Sotah", "chapters": 9},
        "גיטין": {"en": "Gittin", "chapters": 9},
        "קידושין": {"en": "Kiddushin", "chapters": 4}
    },
    "נזיקין": {
        "בבא קמא": {"en": "Bava_Kamma", "chapters": 10},
        "בבא מציעא": {"en": "Bava_Metzia", "chapters": 10},
        "בבא בתרא": {"en": "Bava_Batra", "chapters": 10},
        "סנהדרין": {"en": "Sanhedrin", "chapters": 11},
        "מכות": {"en": "Makkot", "chapters": 3},
        "שבועות": {"en": "Shevuot", "chapters": 8},
        "עדויות": {"en": "Eduyot", "chapters": 8},
        "עבודה זרה": {"en": "Avodah_Zarah", "chapters": 5},
        "אבות": {"en": "Avot", "chapters": 6},
        "הוריות": {"en": "Horayot", "chapters": 3}
    },
    "קדשים": {
        "זבחים": {"en": "Zevachim", "chapters": 14},
        "מנחות": {"en": "Menachot", "chapters": 13},
        "חולין": {"en": "Chullin", "chapters": 12},
        "בכורות": {"en": "Bekhorot", "chapters": 9},
        "ערכין": {"en": "Arakhin", "chapters": 9},
        "תמורה": {"en": "Temurah", "chapters": 7},
        "כריתות": {"en": "Keritot", "chapters": 6},
        "מעילה": {"en": "Meilah", "chapters": 6},
        "תמיד": {"en": "Tamid", "chapters": 7},
        "מדות": {"en": "Middot", "chapters": 5},
        "קינים": {"en": "Kinnim", "chapters": 3}
    },
    "טהרות": {
        "כלים": {"en": "Kelim", "chapters": 30},
        "אהלות": {"en": "Oholot", "chapters": 18},
        "נגעים": {"en": "Negaim", "chapters": 14},
        "פרה": {"en": "Parah", "chapters": 12},
        "טהרות": {"en": "Tahorot", "chapters": 10},
        "מקואות": {"en": "Mikvaot", "chapters": 10},
        "נדה": {"en": "Niddah", "chapters": 10},
        "מכשירין": {"en": "Makhshirin", "chapters": 6},
        "זבים": {"en": "Zavim", "chapters": 5},
        "טבול יום": {"en": "Tevul_Yom", "chapters": 4},
        "ידים": {"en": "Yadayim", "chapters": 4},
        "עוקצין": {"en": "Oktzin", "chapters": 3}
    }
}

def count_words(text):
    """
    סופר מילים בטקסט עברי
    """
    if not text:
        return 0
    # מנקה סימני פיסוק ומחלק לפי רווחים
    words = text.replace(',', ' ').replace('.', ' ').replace(':', ' ').replace(';', ' ').split()
    return len([word for word in words if word.strip()])

def scrape_mishna_chapter_api(masechet_name_en, chapter_num):
    """
    מחלץ פרק בודד דרך API של Sefaria
    """
    api_url = f"https://www.sefaria.org/api/texts/Mishnah_{masechet_name_en}.{chapter_num}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        print(f"  מחלץ פרק {chapter_num}...")
        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if 'he' in data and data['he']:
            mishniots = {}
            hebrew_texts = data['he']
            
            for i, text in enumerate(hebrew_texts, 1):
                if text and text.strip():
                    clean_text = text.strip()
                    mishniots[f"משנה_{i}"] = {
                        "טקסט": clean_text,
                        "מספר_משנה": i,
                        "מספר_מילים": count_words(clean_text)
                    }
            
            return {
                "פרק": chapter_num,
                "משניות": mishniots,
                "מספר_משניות": len(mishniots)
            }
        else:
            print(f"    אין טקסט עברי לפרק {chapter_num}")
            return None
            
    except Exception as e:
        print(f"    שגיאה בפרק {chapter_num}: {e}")
        return None

def scrape_full_masechet(masechet_name_he, masechet_name_en, seder_name, num_chapters):
    """
    מחלץ מסכת מלאה עם כל הפרקים
    """
    print(f"\n=== מחלץ מסכת {masechet_name_he} ({num_chapters} פרקים) ===")
    
    masechet_data = {
        "מסכת": masechet_name_he,
        "מסכת_אנגלית": masechet_name_en,
        "סדר": seder_name,
        "פרקים": {},
        "מטאדטה": {
            "מספר_פרקים": num_chapters,
            "מספר_משניות_סה_כ": 0,
            "מספר_מילים_סה_כ": 0,
            "משניות_לפי_פרק": {}
        }
    }
    
    total_mishniots = 0
    total_words = 0
    
    for chapter_num in range(1, num_chapters + 1):
        chapter_data = scrape_mishna_chapter_api(masechet_name_en, chapter_num)
        
        if chapter_data:
            masechet_data["פרקים"][f"פרק_{chapter_num}"] = chapter_data
            
            # עדכון מטאדטה
            chapter_mishniots = len(chapter_data["משניות"])
            chapter_words = sum(mishna["מספר_מילים"] for mishna in chapter_data["משניות"].values())
            
            total_mishniots += chapter_mishniots
            total_words += chapter_words
            
            masechet_data["מטאדטה"]["משניות_לפי_פרק"][f"פרק_{chapter_num}"] = chapter_mishniots
            
            print(f"    פרק {chapter_num}: {chapter_mishniots} משניות, {chapter_words} מילים")
        else:
            print(f"    נכשל בפרק {chapter_num}")
        
        # המתנה קצרה בין פרקים
        time.sleep(0.5)
    
    # עדכון מטאדטה סופית
    masechet_data["מטאדטה"]["מספר_משניות_סה_כ"] = total_mishniots
    masechet_data["מטאדטה"]["מספר_מילים_סה_כ"] = total_words
    
    print(f"סיום מסכת {masechet_name_he}: {total_mishniots} משניות, {total_words} מילים")
    return masechet_data

def save_masechet_to_json(masechet_data, output_dir="../mishna"):
    """
    שומר מסכת מלאה לקובץ JSON
    """
    if not masechet_data:
        print("אין נתונים לשמירה")
        return False
    
    # יצירת תיקיית פלט אם לא קיימת
    os.makedirs(output_dir, exist_ok=True)
    
    masechet_name = masechet_data["מסכת"]
    filename = f"{masechet_name}.json"
    filepath = os.path.join(output_dir, filename)
    
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(masechet_data, f, ensure_ascii=False, indent=2)
        
        print(f"מסכת {masechet_name} נשמרה: {filepath}")
        return True
        
    except Exception as e:
        print(f"שגיאה בשמירת {masechet_name}: {e}")
        return False

def scrape_all_mishna():
    """
    פונקציה מרכזית לחילוץ כל המשנה
    """
    print("=== מתחיל חילוץ כל המשנה ===")
    print(f"סה\"כ מסכתות לחילוץ: {sum(len(seder) for seder in MISHNA_STRUCTURE.values())}")
    
    success_count = 0
    failed_maschtot = []
    
    for seder_name, maschtot in MISHNA_STRUCTURE.items():
        print(f"\n📚 מתחיל סדר {seder_name} ({len(maschtot)} מסכתות)")
        
        for masechet_he, masechet_info in maschtot.items():
            try:
                masechet_data = scrape_full_masechet(
                    masechet_name_he=masechet_he,
                    masechet_name_en=masechet_info["en"],
                    seder_name=seder_name,
                    num_chapters=masechet_info["chapters"]
                )
                
                if masechet_data and save_masechet_to_json(masechet_data):
                    success_count += 1
                    print(f"✅ {masechet_he} הושלמה בהצלחה")
                else:
                    failed_maschtot.append(f"{seder_name}/{masechet_he}")
                    print(f"❌ {masechet_he} נכשלה")
                
                # המתנה בין מסכתות
                time.sleep(1)
                
            except Exception as e:
                failed_maschtot.append(f"{seder_name}/{masechet_he}")
                print(f"❌ שגיאה במסכת {masechet_he}: {e}")
    
    # סיכום
    print(f"\n=== סיכום ===")
    print(f"מסכתות שהושלמו בהצלחה: {success_count}")
    print(f"מסכתות שנכשלו: {len(failed_maschtot)}")
    
    if failed_maschtot:
        print("מסכתות שנכשלו:")
        for masechet in failed_maschtot:
            print(f"  - {masechet}")
    
    return success_count, failed_maschtot

def create_summary_file(output_dir="../mishna"):
    """
    יוצר קובץ סיכום עם סטטיסטיקות כלליות
    """
    summary = {
        "תאריך_חילוץ": time.strftime("%Y-%m-%d %H:%M:%S"),
        "סה_כ_מסכתות": 0,
        "סה_כ_פרקים": 0,
        "סה_כ_משניות": 0,
        "סה_כ_מילים": 0,
        "פירוט_לפי_סדר": {}
    }
    
    try:
        for seder_name, maschtot in MISHNA_STRUCTURE.items():
            seder_stats = {
                "מסכתות": len(maschtot),
                "פרקים": sum(info["chapters"] for info in maschtot.values()),
                "משניות": 0,
                "מילים": 0,
                "מסכתות_פירוט": {}
            }
            
            for masechet_he, masechet_info in maschtot.items():
                filepath = os.path.join(output_dir, f"{masechet_he}.json")
                
                if os.path.exists(filepath):
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            masechet_data = json.load(f)
                        
                        masechet_mishniots = masechet_data["מטאדטה"]["מספר_משניות_סה_כ"]
                        masechet_words = masechet_data["מטאדטה"]["מספר_מילים_סה_כ"]
                        
                        seder_stats["משניות"] += masechet_mishniots
                        seder_stats["מילים"] += masechet_words
                        
                        seder_stats["מסכתות_פירוט"][masechet_he] = {
                            "פרקים": masechet_info["chapters"],
                            "משניות": masechet_mishniots,
                            "מילים": masechet_words
                        }
                        
                    except Exception as e:
                        print(f"שגיאה בקריאת {masechet_he}: {e}")
            
            summary["פירוט_לפי_סדר"][seder_name] = seder_stats
            summary["סה_כ_מסכתות"] += seder_stats["מסכתות"]
            summary["סה_כ_פרקים"] += seder_stats["פרקים"]
            summary["סה_כ_משניות"] += seder_stats["משניות"]
            summary["סה_כ_מילים"] += seder_stats["מילים"]
        
        # שמירת קובץ הסיכום
        summary_path = os.path.join(output_dir, "_summary.json")
        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        print(f"קובץ סיכום נוצר: {summary_path}")
        
    except Exception as e:
        print(f"שגיאה ביצירת קובץ הסיכום: {e}")

def test_single_masechet(masechet_he="ברכות", seder_name="זרעים"):
    """
    פונקציה לבדיקת מסכת בודדת
    """
    if seder_name not in MISHNA_STRUCTURE:
        print(f"סדר {seder_name} לא נמצא")
        return False
    
    if masechet_he not in MISHNA_STRUCTURE[seder_name]:
        print(f"מסכת {masechet_he} לא נמצאה בסדר {seder_name}")
        return False
    
    masechet_info = MISHNA_STRUCTURE[seder_name][masechet_he]
    
    masechet_data = scrape_full_masechet(
        masechet_name_he=masechet_he,
        masechet_name_en=masechet_info["en"],
        seder_name=seder_name,
        num_chapters=masechet_info["chapters"]
    )
    
    if masechet_data:
        return save_masechet_to_json(masechet_data)
    
    return False

# הרצה ראשית
if __name__ == "__main__":
    print("סקריפט חילוץ המשנה")
    print("===================")
    
    choice = input("\nבחר אפשרות:\n1. בדיקה - מסכת ברכות בלבד\n2. חילוץ כל המשנה (63 מסכתות)\n3. מסכת ספציפית\nבחירה (1/2/3): ")
    
    if choice == "1":
        print("\nמתחיל בדיקה עם מסכת ברכות...")
        if test_single_masechet():
            print("הבדיקה הושלמה בהצלחה!")
        else:
            print("הבדיקה נכשלה")
            
    elif choice == "2":
        confirm = input("\nזה יארך זמן רב ויחלץ 63 מסכתות. להמשיך? (y/n): ")
        if confirm.lower() == 'y':
            success, failed = scrape_all_mishna()
            create_summary_file()
            print(f"\nסיום! הושלמו {success} מסכתות מתוך 63")
        else:
            print("הפעולה בוטלה")
            
    elif choice == "3":
        seder = input("הכנס שם סדר: ")
        masechet = input("הכנס שם מסכת: ")
        if test_single_masechet(masechet, seder):
            print(f"מסכת {masechet} הושלמה בהצלחה!")
        else:
            print(f"שגיאה במסכת {masechet}")
    
    else:
        print("בחירה לא תקינה")