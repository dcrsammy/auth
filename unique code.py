import random
import string

def generate_unique_codes(num_codes=100):
    codes = set()  # To ensure uniqueness
    while len(codes) < num_codes:
        code = "DCR-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        codes.add(code)
    
    # Save to a file
    with open("product_codes.txt", "w") as file:
        for code in codes:
            file.write(code + "\n")

    print(f"{num_codes} unique product codes generated and saved to 'product_codes.txt'.")

generate_unique_codes()
