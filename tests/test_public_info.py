import unittest
from config import site_info


class PublicInfoTests(unittest.TestCase):
    def test_address(self):
        answer = site_info.public_info_response("Wo seid ihr?")
        self.assertIn("Tempelhofer Ufer 36", answer)
        self.assertIn("2. Hinterhaus", answer)
        self.assertNotIn("Parkplätze", answer)

    def test_opening_hours_are_not_invented(self):
        answer = site_info.public_info_response("Wann habt ihr geöffnet?")
        self.assertIn("Wodify", answer)
        self.assertNotIn("21:00", answer)

    def test_prices_are_not_invented(self):
        answer = site_info.public_info_response("Was kostet die Mitgliedschaft?")
        self.assertIn("info@g3crossfit.com", answer)
        self.assertNotIn("89", answer)

    def test_context_does_not_override_latest_question(self):
        prompt = 'Kontext: Probetraining, Preise, Standort. Der Nutzer sagt: "Wann habt ihr geöffnet?"'
        self.assertIn("Wodify", site_info.public_info_response(prompt))
        self.assertIn(
            "Wodify",
            site_info.public_info_response(prompt.replace("Nutzer", "Anrufer")),
        )

    def test_workout_is_not_a_location_question(self):
        self.assertIsNone(site_info.public_info_response("Wie sieht ein Workout aus?"))

    def test_trial_is_request_not_confirmation(self):
        self.assertIn("anfragen", site_info.public_info_response("Probetraining"))


if __name__ == "__main__":
    unittest.main()
