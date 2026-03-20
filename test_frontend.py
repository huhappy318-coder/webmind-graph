from playwright.sync_api import sync_playwright

def test_frontend_model_selector():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the frontend
        page.goto("http://localhost:8001")
        page.wait_for_load_state("networkidle")

        # Take a screenshot of the page
        page.screenshot(path="frontend_screenshot.png", full_page=True)

        # Check if the model selector is present
        model_selector = page.locator("#modelSelector")
        assert model_selector.is_visible(), "Model selector is not visible"

        # Get all options in the model selector
        options = model_selector.locator("option")
        option_count = options.count()
        print(f"Number of options in model selector: {option_count}")

        # Check if all six providers are present
        expected_providers = [
            "Anthropic Claude",
            "OpenAI GPT-4o",
            "Google Gemini",
            "DeepSeek",
            "Qwen/通义千问",
            "Kimi/月之暗面"
        ]

        actual_providers = []
        for i in range(option_count):
            option_text = options.nth(i).text_content()
            actual_providers.append(option_text.strip())

        print(f"Actual providers in model selector: {actual_providers}")

        # Check if all expected providers are present
        for provider in expected_providers:
            assert provider in actual_providers, f"Provider '{provider}' not found in model selector"

        # Check if unconfigured providers are disabled (gray)
        for i in range(1, option_count):
            option = options.nth(i)
            is_disabled = option.is_disabled()
            provider_name = actual_providers[i]
            print(f"Provider '{provider_name}' is disabled: {is_disabled}")
            # Since we haven't configured any API keys, all should be disabled
            assert is_disabled, f"Provider '{provider_name}' should be disabled"

        print("Frontend model selector test passed!")
        browser.close()

if __name__ == "__main__":
    test_frontend_model_selector()